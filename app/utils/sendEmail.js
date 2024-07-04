import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, html, text) => {

  try {

    const transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: process.env.PORT_EMAIL,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
      },
    });

    // verify connection configuration
    transporter.verify(function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    await transporter.sendMail({
      from: "noreply@obookgroove.studio",
      to: email,
      subject,
      text,
      html,
    });

    console.log('Email envoyé avec succès !');

  } catch (err) {
    console.error(err.message, 'Email non envoyé !');
  }

};
