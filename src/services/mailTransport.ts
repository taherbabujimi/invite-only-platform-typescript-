import { google } from "googleapis";
import nodemailer from "nodemailer";

export const emailTransport = async (
  from: string,
  to: string | string[],
  subject: string,
  html: string
) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const accessToken = await oauth2Client.getAccessToken();

  // Fix: Use the correct transport configuration with proper typing
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "taher.babuji@mindinventory.com",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token || "",
    },
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };

  return await transport.sendMail(mailOptions);
};
