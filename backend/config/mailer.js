import nodemailer from "nodemailer";

const clean = (v) => String(v || "").trim();
const pass = () => clean(process.env.SMTP_PASS).replace(/\s+/g, "");

const isBrevoSmtpLogin = (user) => /@smtp-brevo\.com$/i.test(user);

const getBrevoApiKey = () => {
  const key = clean(process.env.BREVO_API_KEY);
  if (key.startsWith("xkeysib-")) return key;
  const smtpPass = pass();
  if (smtpPass.startsWith("xkeysib-")) return smtpPass;
  return "";
};

const isSmtpConfigured = () =>
  Boolean(clean(process.env.SMTP_HOST) && clean(process.env.SMTP_USER) && pass());

const buildSmtpTransport = () => {
  if (!isSmtpConfigured()) return null;

  const host = clean(process.env.SMTP_HOST).toLowerCase();
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = clean(process.env.SMTP_USER);

  const base = {
    host: clean(process.env.SMTP_HOST),
    port,
    secure: port === 465,
    auth: { user, pass: pass() },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  };

  if (host.includes("brevo.com") || host.includes("sendinblue.com")) {
    return nodemailer.createTransport({
      ...base,
      secure: false,
      requireTLS: true,
      tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    });
  }

  if (host.includes("gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: clean(process.env.SMTP_USER), pass: pass() },
    });
  }

  return nodemailer.createTransport(base);
};

const transporter = buildSmtpTransport();

const logDevOtp = (to, otp, reason) => {
  console.log("\n========================================");
  console.log(`[Pollify OTP — DEV FALLBACK] ${reason}`);
  console.log(`Email: ${to}`);
  console.log(`Code:  ${otp}`);
  console.log("========================================\n");
};

const otpHtml = (otp, reason) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:linear-gradient(135deg,#eef2ff,#fdf4ff);border-radius:20px">
    <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid #e2e8f0">
      <div style="font-size:28px;margin-bottom:8px">🗳️</div>
      <h2 style="color:#4f46e5;margin:0 0 8px;font-size:22px">Pollify</h2>
      <p style="color:#475569;margin:0 0 16px">Use this code to ${reason}:</p>
      <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#0f172a;background:#f8fafc;border-radius:12px;padding:16px;text-align:center">${otp}</div>
      <p style="color:#94a3b8;font-size:13px;margin:16px 0 0">Expires in 10 minutes. Never share this code.</p>
    </div>
  </div>`;

const sendViaBrevoApi = async (to, otp, reason) => {
  const apiKey = getBrevoApiKey();
  if (!apiKey) return null;

  const fromEmail = clean(process.env.EMAIL_FROM) || clean(process.env.SMTP_USER);
  if (!fromEmail) {
    throw new Error("EMAIL_FROM is required for Brevo API sending.");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Pollify", email: fromEmail },
      to: [{ email: to }],
      subject: `${otp} — Your Pollify verification code`,
      textContent: `Your Pollify code is ${otp}. It expires in 10 minutes.`,
      htmlContent: otpHtml(otp, reason),
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = body?.message || body?.error || `Brevo API error (${res.status})`;
    throw new Error(msg);
  }

  console.log(`[Email] OTP sent via Brevo API to ${to}`);
  return { mode: "brevo-api", messageId: body?.messageId };
};

const sendViaSmtp = async (to, otp, reason) => {
  if (!transporter) return null;

  const fromAddress = clean(process.env.EMAIL_FROM) || clean(process.env.SMTP_USER);

  const info = await transporter.sendMail({
    from: `"Pollify" <${fromAddress}>`,
    to,
    replyTo: fromAddress,
    subject: `${otp} — Your Pollify verification code`,
    text: `Your Pollify code is ${otp}. It expires in 10 minutes.`,
    html: otpHtml(otp, reason),
  });

  console.log(`[Email] OTP sent via SMTP to ${to} (${info.messageId || "ok"})`);
  return { mode: "smtp", messageId: info.messageId };
};

export const verifyEmailSetup = async () => {
  const brevoKey = getBrevoApiKey();
  if (brevoKey) {
    console.log("[Email] Brevo API key found — OTP will use Transactional API.");
    return true;
  }

  if (!transporter) {
    console.warn("[Email] SMTP not configured. Set BREVO_API_KEY or SMTP credentials.");
    return false;
  }

  try {
    await transporter.verify();
    console.log("[Email] SMTP connected successfully.");
    return true;
  } catch (error) {
    console.error("[Email] SMTP verify failed:", error.message);
    if (isBrevoSmtpLogin(clean(process.env.SMTP_USER))) {
      console.error(
        "[Email] Brevo SMTP blocked? Add BREVO_API_KEY (xkeysib-...) from Brevo → Settings → API Keys.",
      );
      console.error(
        "[Email] Also verify sender email in Brevo → Senders & IP → Senders.",
      );
    }
    return false;
  }
};

export const sendOtpEmail = async (to, otp, reason = "verify your email") => {
  const errors = [];

  try {
    const apiResult = await sendViaBrevoApi(to, otp, reason);
    if (apiResult) return apiResult;
  } catch (error) {
    errors.push(`Brevo API: ${error.message}`);
    console.error("[Email Error]", errors.at(-1));
  }

  try {
    const smtpResult = await sendViaSmtp(to, otp, reason);
    if (smtpResult) return smtpResult;
  } catch (error) {
    errors.push(`SMTP: ${error.message}`);
    console.error("[Email Error]", errors.at(-1));
  }

  if (process.env.NODE_ENV !== "production" || process.env.DEV_OTP === "true") {
    logDevOtp(to, otp, reason);
    return { mode: "dev-fallback" };
  }

  if (/525|535|authentication|unauthorized ip|sender|verified/i.test(errors.join(" "))) {
    throw new Error(
      "Email could not be sent. Add BREVO_API_KEY in backend .env and verify your sender email in Brevo.",
    );
  }

  throw new Error("Could not send verification email. Please try Resend OTP shortly.");
};
