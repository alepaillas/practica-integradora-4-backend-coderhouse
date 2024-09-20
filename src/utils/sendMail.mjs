import nodemailer from "nodemailer";
import envConfig from "../config/env.config.mjs";
import customErrors from "../errors/customErrors.mjs";

export const sendMail = async (email, subject, message, template) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "alepaillas@gmail.com",
      pass: envConfig.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: "alepaillas@gmail.com",
      to: email,
      subject,
      text: message,
      html: template,
    });
  } catch (error) {
    // Log detailed error message
    console.error("Error details:", error);
    throw customErrors.createError(
      `Failed to send email: ${error.message}`,
      500,
    );
  }
};

export const sendMailWithAttachment = async (
  email,
  subject,
  message,
  template,
) => {
  const attachmentURI = new URL("../public/img/gatito.jpg", import.meta.url);
  const attachmentPath = attachmentURI.pathname;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "alepaillas@gmail.com",
      pass: envConfig.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMailWithAttachment({
      from: "alepaillas@gmail.com",
      to: email,
      subject,
      text: message,
      html: template,
      attachments: [
        {
          filename: "gatito.jpg",
          path: attachmentPath,
          cid: "gatito",
        },
      ],
    });
  } catch (error) {
    // Log detailed error message
    console.error("Error details:", error);
    throw customErrors.createError(
      `Failed to send email: ${error.message}`,
      500,
    );
  }
};
