const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Reads an HTML file from the blueoceanEmails folder.
 * @param {string} filename - The name of the HTML file to read.
 * @returns {Promise<string>} - Resolves with the HTML content.
 */
function getHtmlFromFile(filename) {
  const filePath = path.join(__dirname, '..', 'blueoceanEmails', filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

/**
 * Sends an email using the provided parameters and an HTML file as the body.
 * @param {Object} options
 * @param {Array} options.recipients - Array of recipient objects.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text body.
 * @param {string} options.htmlFile - Name of the HTML file to use as body.
 * @returns {Promise<Object>}
 */
async function sendMailWithHtmlFile({ recipients, subject, text, htmlFile }) {
  const to = recipients.map(obj => Object.values(obj)[0]).join(',');
  let html = '';
  if (htmlFile) {
    html = await getHtmlFromFile(htmlFile);
  }
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"Blue Ocean Pickup" <${process.env.EMAIL_ID}>`,
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

// send mail
/**
 * Sends an email using the provided parameters.
 * @param {Object} options
 * @param {Array} options.recipients - Array of recipient objects.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text body.
 * @param {string} [options.html] - HTML body (optional).
 * @returns {Promise<Object>} - Resolves with info if sent, rejects with error.
 */
function sendMailWithText({ recipients, subject, text, html }) {
  // Extract all email addresses from the array

  const to = recipients.map(obj => Object.values(obj)[0]).join(',')


  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"Blue Ocean Pickup" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
      ...(html && { html })
    };

    console.log(JSON.stringify(mailOptions, null, 2));

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
}

module.exports = {
  sendMailWithHtmlFile,
  sendMailWithText
};
