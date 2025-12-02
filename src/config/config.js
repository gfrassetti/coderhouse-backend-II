import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || "development",
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "coderhouseSecret",
    expiration: process.env.JWT_EXPIRATION || "1h",
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:3000",
  },
  passwordReset: {
    expiration: parseInt(
      process.env.PASSWORD_RESET_EXPIRATION || "3600"
    ), // 1 hora en segundos
  },
};

