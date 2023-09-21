const sgMail = require('@sendgrid/mail')
const { SENDGRID_API_KEY, SENDER_MAIL } = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

const sendMessage = async (message) => {
	message.from = SENDER_MAIL

	await sgMail.send(message).then((data) => {
		console.log(data);
	}).catch((err) => { console.log(err) })
}

module.exports = sendMessage