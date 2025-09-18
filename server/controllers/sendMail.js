const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const eventEmails = require('./eventEmails');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});


function getHtmlFromFile(filename) {
  const filePath = path.join(__dirname, '..', 'blueoceanEmails', filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

async function sendEventReminders(startTime, endTime) {
  const events = await eventEmails.getEventsPlayersWithEmailsBetween(startTime, endTime);
  if (!events || events.length === 0) {
   return;
  }
  let html = await getHtmlFromFile('eventReminder.html');
  events.forEach(event => {
    const { players } = event;
    if (!players || players.length === 0) {
      return;
    }

    const filteredPlayers = players.filter(player => player.emailPrimary);
    const validPlayers = filteredPlayers.filter(
      player => player.emailPrimary || player.emailSecondary
    );

    if (validPlayers.length === 0) {
      return;
    }

    const emailPromises = validPlayers.map(player => {
      const { emailPrimary, emailSecondary } = player;
      const subject = `Reminder: Upcoming Event - ${event.title}`;
      const text = `Hi there! Just a reminder about the upcoming event: ${event.title}`;

      const recipients = [{ email: emailPrimary }];
      if (emailSecondary) {
        recipients.push({ email: emailSecondary });
      }
      return sendMailWithHtmlFileAndParams({
        recipients: [{ email: emailPrimary }, { email: emailSecondary }],
        subject,
        text,
        htmlFile: 'eventReminder.html',
        htmlParams: {
          EVENT_TITLE: event.title,
          EVENT_TIME: event.time,
          SITE_NAME: process.env.EMAIL_SITE_LABEL,
          PICKNROLL_URL: `${process.env.HOST}/login`}
      });
    });

    Promise.all(emailPromises)
      .then(results => {
        //console.log(`Successfully sent reminder emails for event ${event._id}`);
      })
      .catch(error => {
        console.error(`Error sending reminder emails for event ${event._id}:`, error);
      });
  });

}

async function getHtmlFromFileWithParams(filename, params = {}) {
  let html = await getHtmlFromFile(filename);
  for (const [key, value] of Object.entries(params)) {
    //console.log(`Replacing {{${key}}} with ${value}`);
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, value);
  }
  return html;
}

async function sendMailWithHtmlFileAndParams({ recipients, subject, text, htmlFile, htmlParams }) {
  const to = recipients.map(obj => Object.values(obj)[0]).join(',');
  let html = '';
  if (htmlFile) {
    html = await getHtmlFromFileWithParams(htmlFile, htmlParams || {});
  }
  //console.log('HTML Params:', htmlParams);
  //console.log('HTML:', html);
  // The placeholder format in the HTML file should be: {{key}}
  // For example, if your htmlParams is { "PICKNROLL_URL": `${process.env.HOST}/login` },
  // then your HTML file should contain {{PICKNROLL_URL}} where you want `${process.env.HOST}/login` to appear.
 return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"${process.env.EMAIL_SITE_LABEL}" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
      ...(html && { html })
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);
      resolve(info);
    });
  });
}


module.exports = {
  sendEventReminders,
  sendMailWithHtmlFileAndParams
};
