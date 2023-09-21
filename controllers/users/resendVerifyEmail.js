
const sendMessage = require("../../helpers/emailSendler.js");
const { PORT } = process.env;
const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");


const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(404, "User not found");
	}

	if (user.verify) {
		throw HttpError(400, "Verification has already been passed");
	}

	await sendMessage({
		to: user.email,
		subject: "To verify your email",
		html: `
	  <p>To confirm your registration, please click on link below</p>
	  <p>
		<a href='http://localhost:${PORT}/api/users/verify/${user.verificationToken}'>Follow me</a>
	  </p>`,
		text: `
	  To confirm your registration, please click on link below\n
	  http://localhost:${PORT}/api/users/verify/${user.verificationToken}
	  `,
	});

	res.json({ message: "Verification email send" });
};
module.exports = resendVerifyEmail