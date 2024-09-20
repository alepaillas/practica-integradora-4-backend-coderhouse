import dotenv from "dotenv";

const environment = "DEV";
dotenv.config({
  path: environment === "PROD" ? "./.env.prod" : "./.env.dev",
});

export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  COOKIE_TOKEN: process.env.COOKIE_TOKEN,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  BASE_URL: process.env.BASE_URL,
};
