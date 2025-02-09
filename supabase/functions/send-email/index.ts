// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

export interface Payload {
  subject: string
  recipient_email: string
  recipient_name: string
  from: string
  content: Content
}

export interface Content {
  report?: Report,
  circleUserId: string,
}

export interface Report {
  type: string
  message_1: string
  message_2: string,
  expense_amount: number,
  income_amount: number
}


const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const handler = async (_request: Request): Promise<Response> => {
  try {
    const payload: Payload = await _request.json();

    let content;

    try {
      const token = await generateToken(payload);
      const unsubLink = `https://${Deno.env.get('APP_DOMAIN')}/mail?type=unsubscribe&token=${token}`;

      if (payload.content.report) {
        content = emailHtml(payload, unsubLink);
      }

      if (!content) {
        return new Response(JSON.stringify({
          status: 'failed',
          message: 'Content unavailable'
        }), {
          status: 422,
        });
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          'to': [
            payload.recipient_email
          ],
          'from': payload.from,
          'subject': payload.subject,
          'html': content
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Email API error: ${JSON.stringify(errorData)}`);
      }

      return new Response(JSON.stringify({
        status: 'ok'
      }), {
        status: 200,
      });

    } catch (error) {
      console.error('Email processing error:', error);
      return new Response(JSON.stringify({
        status: 'failed',
        message: 'Failed to process email request',
        error: error.message
      }), {
        status: 500,
      });
    }

  } catch (error) {
    console.error('Request parsing error:', error);
    return new Response(JSON.stringify({
      status: 'failed',
      message: 'Invalid request payload',
      error: error.message
    }), {
      status: 400,
    });
  }
};

serve(handler)


function base64url_encode(buffer: ArrayBuffer): string {
  return btoa(Array.from(new Uint8Array(buffer), b => String.fromCharCode(b)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const generateToken = async (payload: Payload) => {
  const textEncoder = (d: string) => new TextEncoder().encode(d)

  const secretKey = Deno.env.get('APP_SECRET_KEY');
  const header = { alg: 'HS256', typ: 'JWT' }
  const data = { circleUserId: payload.content.circleUserId }

  const encodedHeader = base64url_encode(textEncoder(JSON.stringify(header)));
  const encodedPayload = base64url_encode(textEncoder(JSON.stringify(data)));
  const oTkn = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey("raw", textEncoder(secretKey), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  const signature = base64url_encode(new Uint8Array(await crypto.subtle.sign({ name: "HMAC" }, key, textEncoder(oTkn))))
  return `${oTkn}.${signature}`
}

const emailHtml = (payload: Payload, unsubLink: String) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Financial Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      color: #2d3748;
    }
    .container {
      max-width: 600px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 32px;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      position: relative;
    }
    .logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin-bottom: 16px;
      background: white;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header-title {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #1a202c;
    }
    .message {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .stats-container {
      background: #f8fafc;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
    }
    .stats-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1a202c;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }
    .stat-label {
      font-size: 16px;
      color: #4a5568;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-value {
      font-size: 18px;
      font-weight: 600;
    }
    .expense {
      color: #e53e3e;
    }
    .income {
      color: #38a169;
    }
    .balance-row {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
    }
    .balance {
      font-size: 20px;
      font-weight: 600;
      text-align: right;
      color: ${(payload.content.report?.income_amount ?? 0) - (payload.content.report?.expense_amount ?? 0) >= 0 ? '#38a169' : '#e53e3e'};
    }
    .footer {
      text-align: center;
      padding: 32px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #f97316;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .footer-links {
      margin-top: 16px;
      font-size: 14px;
      color: #718096;
    }
    .copyright {
      margin-top: 16px;
      font-size: 12px;
      color: #a0aec0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://assets.unlayer.com/projects/176864/1691487083616-logo-inving.png" alt="Inving Logo" class="logo">
      <h1 class="header-title">Weekly Financial Report</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi${payload.recipient_name ? ` ${payload.recipient_name}` : ''}! 👋
      </div>
      
      <div class="message">
        ${payload.content.report?.message_1 ?? ''}
      </div>

      <div class="stats-container">
        <div class="stats-title">Last Week's Activity</div>
        
        <div class="stat-row">
          <span class="stat-label">💰 Income</span>
          <span class="stat-value income">${formatter.format(payload.content.report?.income_amount ?? 0)}</span>
        </div>
        
        <div class="stat-row">
          <span class="stat-label">💸 Expenses</span>
          <span class="stat-value expense">${formatter.format(payload.content.report?.expense_amount ?? 0)}</span>
        </div>

        <div class="stat-row balance-row">
          <span class="stat-label">Net Balance</span>
          <span class="balance">${formatter.format((payload.content.report?.income_amount ?? 0) - (payload.content.report?.expense_amount ?? 0))}</span>
        </div>
      </div>

      <div class="message">
        ${payload.content.report?.message_2 ?? ''}
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <p style="margin: 0; color: #4a5568;">Best regards,</p>
        <p style="margin: 4px 0; font-weight: 600; color: #1a202c;">The Inving Team</p>
      </div>
    </div>

    <div class="footer">
      <a href="mailto:mail@kluarga.com">mail@kluarga.com</a>
      <div class="footer-links">
        <a href="${unsubLink}">Unsubscribe</a> | 
        <a href="https://finansial.kluarga.com/">Edit your details</a>
      </div>
      <div class="copyright">
        © 2023 Inving. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `
}

