export const forgotPasswordHTML = (link) => {
  return `<!DOCTYPE html>
      <html>
      <head>
        <title>Invite Link</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 5px;
            color: black;
          }
          h1 {
            text-align: center;
          }
          p {
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Forgot Password Link</h1>
          <p>Click the button below to reset your password. Link will be valid only for the next 24 hours.</p>
          <a href="${link}" class="button">Reset Password</a>
        </div>
      </body>
      </html>`;
};
