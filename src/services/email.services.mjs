import { sendMail, sendMailWithAttachment } from "../utils/sendMail.mjs";
import customErrors from "../errors/customErrors.mjs";
import envConfig from "../config/env.config.mjs";

const BASE_URL = envConfig.BASE_URL;
const PORT = envConfig.PORT;

const sendWelcomeEmail = async (email, name) => {
  const template = `
    <div>
      <h1>Bienvenid@ ${name} a nuestra App</h1>
      <img src="cid:gatito" />
    </div>
  `;

  try {
    await sendMailWithAttachment(
      email,
      "Welcome to Our App",
      "This is a test message",
      template,
    );
  } catch (error) {
    // Re-throw with more context if necessary
    throw customErrors.createError(
      `Failed to send welcome email: ${error.message}`,
      500,
    );
  }
};

const sendRestorePasswordEmail = async (email, token) => {
  const resetLink = `${BASE_URL}:${PORT}/restorePassword?token=${token}`;
  const template = `
    <div>
      <h1>Aquí esta tu enlace para cambiar tu contraseña.</h1>
      <p>Este vínculo expirará dentro de 1 hora.</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Reestablecer Contraseña.
      </a>
    </div>
  `;

  try {
    await sendMail(
      email,
      "Restore password",
      "", // No need for text body, as the HTML is sufficient
      template,
    );
  } catch (error) {
    // Re-throw with more context if necessary
    throw customErrors.createError(
      `Failed to send restore password email: ${error.message}`,
      500,
    );
  }
};

export default {
  sendWelcomeEmail,
  sendRestorePasswordEmail,
};
