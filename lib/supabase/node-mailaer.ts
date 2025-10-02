import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_PASSWORD,
    pass: process.env.APP_EMAIL,
  },
});
