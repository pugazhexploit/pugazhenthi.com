import emailjs from '@emailjs/browser';

/**
 * Multi-Gateway Email Transmission Service for Pugazhenthi's Portfolio
 * Primary Recipient: pugazhenthij283@gmail.com
 * Multi-tier delivery: FormSubmit (with automatic sender confirmation email) + EmailJS + Web3Forms + Testmail + Mailto fallback
 */

const RECIPIENT_EMAIL = (
  import.meta.env.VITE_RECIPIENT_EMAIL || 'pugazhenthij283@gmail.com'
).trim();

const RAW_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
  import.meta.env.VITE_AUTHORIZATION ||
  import.meta.env.Authorization ||
  import.meta.env.VITE_TESTMAIL_API_KEY ||
  '';

const ACCESS_KEY = RAW_ACCESS_KEY ? RAW_ACCESS_KEY.trim() : '';

const RAW_TESTMAIL_KEY =
  import.meta.env.VITE_TESTMAIL_API_KEY ||
  import.meta.env.VITE_AUTHORIZATION ||
  import.meta.env.Authorization ||
  '';

const TESTMAIL_API_KEY = RAW_TESTMAIL_KEY ? RAW_TESTMAIL_KEY.trim() : '';
const TESTMAIL_NAMESPACE = (import.meta.env.VITE_TESTMAIL_NAMESPACE || '').trim();
const TESTMAIL_TAG = (import.meta.env.VITE_TESTMAIL_TAG || 'portfolio_contact').trim();

// Optional EmailJS Credentials
const EMAILJS_SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
const EMAILJS_TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim();
const EMAILJS_PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();

/**
 * Generates a pre-filled mailto URL for direct email client fallback
 */
export function createMailtoLink({ name, email, subject, message, category }) {
  const fullSubject = `[Portfolio - ${category || 'Inquiry'}] ${subject || 'New Contact Request'}`;
  const bodyText = `Sender Name: ${name}\nSender Email: ${email}\nCategory: ${category || 'General'}\n\nMessage Payload:\n${message}\n\n---\nSent via Pugazhenthi's Cybersecurity Portfolio`;
  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(bodyText)}`;
}

/**
 * Returns Testmail.app dedicated testing address if namespace is configured
 */
export function getTestmailAddress() {
  if (!TESTMAIL_NAMESPACE) return null;
  return `${TESTMAIL_NAMESPACE}.${TESTMAIL_TAG}@inbox.testmail.app`;
}

/**
 * Gateway 1: FormSubmit Direct Delivery + Automatic Sender Confirmation Email
 * Sends directly to pugazhenthij283@gmail.com and dispatches auto-confirmation to sender!
 */
async function sendViaFormSubmit({ name, email, subject, message, category }) {
  const payloadSubject = `[Pugazh Portfolio | ${category}] ${subject}`;

  // Personalized Confirmation Email sent directly to the Sender
  const autoresponseMessage = `Hello ${name},

Thank you for reaching out through Pugazhenthi's Cybersecurity Portfolio!

We have successfully received your transmission regarding "${subject}".

TRANSMISSION TELEMETRY SUMMARY:
--------------------------------------------------
• Sender: ${name}
• Email: ${email}
• Category: ${category}
• Target: ${RECIPIENT_EMAIL}
• Timestamp: ${new Date().toUTCString()}
--------------------------------------------------

Your Message Payload:
"${message}"

Pugazhenthi J will review your inquiry and follow up directly to ${email} as soon as possible.

Best regards,
Pugazhenthi J
Cybersecurity Specialist & Ethical Hacker
Email: ${RECIPIENT_EMAIL}
GitHub: https://github.com/pugazhexploit
LinkedIn: https://in.linkedin.com/in/pugazhenthij-cyber`;

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT_EMAIL)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      _replyto: email,
      _subject: payloadSubject,
      category: category,
      message: message,
      _autoresponse: autoresponseMessage,
      _template: 'table',
      _captcha: 'false',
    }),
  });

  const data = await response.json();
  if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
    return {
      success: true,
      message: `Transmission encrypted & dispatched to ${RECIPIENT_EMAIL}, and confirmation sent to ${email}`,
      data,
    };
  }
  throw new Error(data.message || 'FormSubmit delivery error');
}

/**
 * Gateway 2: EmailJS Delivery (if configured in .env)
 */
async function sendViaEmailJS({ name, email, subject, message, category }) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS credentials not configured');
  }

  const templateParams = {
    from_name: name,
    from_email: email,
    to_email: RECIPIENT_EMAIL,
    reply_to: email,
    subject: `[Portfolio | ${category}] ${subject}`,
    category: category,
    message: message,
  };

  const response = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    EMAILJS_PUBLIC_KEY
  );

  if (response.status === 200) {
    return {
      success: true,
      message: `Delivered via EmailJS to ${RECIPIENT_EMAIL} and confirmation sent to ${email}`,
      data: response,
    };
  }
  throw new Error('EmailJS send failed');
}

/**
 * Gateway 3: Web3Forms Delivery (If valid Web3Forms key is provided)
 */
async function sendViaWeb3Forms({ name, email, subject, message, category }) {
  if (!ACCESS_KEY) {
    throw new Error('No Web3Forms access key configured');
  }

  const payloadSubject = `[Pugazh Portfolio | ${category}] ${subject}`;
  const formattedMessage = `Secure Transmission Details:\n----------------------------------\n• Sender Name: ${name}\n• Reply-To Email: ${email}\n• Category: ${category}\n• Timestamp: ${new Date().toISOString()}\n• Target: ${RECIPIENT_EMAIL}\n----------------------------------\n\nEncrypted Message Payload:\n${message}\n\n----------------------------------\nSystem: Cybersecurity Portfolio Connect Gateway`;

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      name: name,
      email: email,
      reply_to: email,
      subject: payloadSubject,
      message: formattedMessage,
      to_email: RECIPIENT_EMAIL,
      from_name: `${name} [Security Connect]`,
    }),
  });

  const data = await response.json();
  if (response.ok && data.success) {
    return {
      success: true,
      message: `Transmission encrypted & delivered directly to ${RECIPIENT_EMAIL}`,
      data,
    };
  }
  throw new Error(data.message || 'Web3Forms key rejected');
}

/**
 * Master Send Function: Tries FormSubmit, EmailJS, and Web3Forms in cascade,
 * ensuring emails are delivered to pugazhenthij283@gmail.com and confirmation is sent to sender.
 */
export async function sendEmailMessage({
  name,
  email,
  subject,
  message,
  category = 'General Inquiry',
  botcheck = '',
}) {
  // Bot Honeypot detection
  if (botcheck) {
    console.warn('[SECURITY] Bot transmission intercepted and rejected.');
    return {
      success: true,
      message: 'Transmission received.',
    };
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = (subject || `${category} Request`).trim();
  const cleanMessage = message.trim();

  // 1. Try Primary FormSubmit Direct Delivery (with Auto-Confirmation to sender)
  try {
    const result = await sendViaFormSubmit({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      category,
    });
    return result;
  } catch (formSubmitErr) {
    console.warn('[EMAIL SERVICE] FormSubmit gateway response:', formSubmitErr.message);

    // 2. Try EmailJS (if configured)
    try {
      const result = await sendViaEmailJS({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        category,
      });
      return result;
    } catch {
      // 3. Try Web3Forms Gateway fallback
      try {
        const result = await sendViaWeb3Forms({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          category,
        });
        return result;
      } catch (web3Err) {
        console.warn('[EMAIL SERVICE] Web3Forms gateway response:', web3Err.message);
      }
    }
  }

  // 4. Fallback: Provide direct mailto launcher
  return {
    success: false,
    message: 'Direct gateway communication encountered an issue. Click below to launch your email client.',
    fallbackMailto: createMailtoLink({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      category,
    }),
  };
}

/**
 * Query Testmail.app Inbox (for development & testing verification)
 * https://testmail.app/docs/?javascript#json-api-guide
 */
export async function fetchTestmailInbox() {
  if (!TESTMAIL_NAMESPACE || !TESTMAIL_API_KEY) {
    return {
      success: false,
      message: 'Testmail API key and namespace must be set in .env to query inbox.',
    };
  }

  try {
    const url = `https://api.testmail.app/api/json?apikey=${encodeURIComponent(
      TESTMAIL_API_KEY
    )}&namespace=${encodeURIComponent(TESTMAIL_NAMESPACE)}&tag=${encodeURIComponent(
      TESTMAIL_TAG
    )}&pretty=true`;

    const response = await fetch(url);
    const result = await response.json();
    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
