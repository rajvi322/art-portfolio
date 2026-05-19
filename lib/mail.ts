import nodemailer from "nodemailer";

interface EmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const sendInquiryEmail = async (params: EmailParams) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER || "rs.artelier3@gmail.com";
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) {
    console.warn("SMTP_PASSWORD is not set. Skipping email sending.");
    return null;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  // 1. Email to Admin/Curator
  const adminMailOptions = {
    from: `"${params.name} via Arté Portfolio" <${user}>`,
    to: user,
    replyTo: params.email,
    subject: `[New Inquiry] ${params.subject}`,
    text: `You have received a new inquiry from your Arté Portfolio website.\n\n` +
          `Sender Details:\n` +
          `- Name: ${params.name}\n` +
          `- Email: ${params.email}\n` +
          `- Phone: ${params.phone || "Not provided"}\n\n` +
          `Subject: ${params.subject}\n\n` +
          `Message:\n${params.message}\n\n` +
          `Reply directly to this email to contact ${params.name}.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 8px;">
        <h2 style="color: #111; font-size: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; margin-bottom: 20px;">New Gallery Inquiry</h2>
        <p style="font-size: 14px; color: #555; line-height: 1.5;">You have received a new message from the contact form of your portfolio archive.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666; width: 120px;">Name:</td>
            <td style="padding: 8px 0; color: #111;">${params.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
            <td style="padding: 8px 0; color: #111;"><a href="mailto:${params.email}">${params.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
            <td style="padding: 8px 0; color: #111;">${params.phone || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Subject:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #111;">${params.subject}</td>
          </tr>
        </table>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 3px solid #111; font-size: 14px; color: #333; line-height: 1.6; white-space: pre-wrap; margin-bottom: 25px;">
          ${params.message}
        </div>
        
        <p style="font-size: 12px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 25px;">
          This is an automated notification. Reply directly to this email to contact the sender.
        </p>
      </div>
    `,
  };

  // 2. Email Confirmation to the Sender
  const senderMailOptions = {
    from: `"Arté Portfolio" <${user}>`,
    to: params.email,
    subject: `Thank you for contacting Arté Portfolio`,
    text: `Dear ${params.name},\n\n` +
          `Thank you for reaching out. Your inquiry regarding "${params.subject}" has been received and is being processed.\n\n` +
          `We will review your message and get back to you shortly.\n\n` +
          `Best regards,\n` +
          `Arté Portfolio Support`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; rounded: 8px;">
        <h2 style="color: #111; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; margin-bottom: 20px;">Inquiry Received</h2>
        <p style="font-size: 14px; color: #333; line-height: 1.6;">Dear ${params.name},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6;">
          Thank you for reaching out. We have successfully received your inquiry regarding <strong>"${params.subject}"</strong>.
        </p>
        <p style="font-size: 14px; color: #555; line-height: 1.6;">
          Our curator will review the details and get back to you as soon as possible.
        </p>
        
        <div style="margin: 25px 0; border-top: 1px solid #eaeaea; padding-top: 15px;">
          <p style="font-size: 14px; color: #333; margin-bottom: 5px; font-weight: bold;">Your Inquiry Summary:</p>
          <blockquote style="font-size: 13px; color: #666; font-style: italic; border-left: 2px solid #ccc; padding-left: 10px; margin-left: 0;">
            ${params.message.slice(0, 150)}${params.message.length > 150 ? "..." : ""}
          </blockquote>
        </div>

        <p style="font-size: 14px; color: #333; margin-top: 25px; line-height: 1.6;">
          Best regards,<br/>
          <strong>Arté Portfolio Support</strong>
        </p>
      </div>
    `,
  };

  try {
    // Send both emails in parallel
    const [adminResult, senderResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(senderMailOptions),
    ]);
    return { adminResult, senderResult };
  } catch (error) {
    console.error("Nodemailer sendMail failed:", error);
    throw error;
  }
};
