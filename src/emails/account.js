const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "stefancincaa19@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, $(name). Let me know how you get along with the app`,
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "stefancincaa19@gmail.com",
    subject: "Sorry to see you leave!",
    text: `Goodbye $(name). Could you tell us what made you leave?`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
