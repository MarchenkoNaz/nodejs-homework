const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const crypto = require("node:crypto");

const { PORT, SENDER_MAIL } = process.env;
const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");
const sendMessage = require("../../helpers/emailSendler.js");

const registerUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, 'User is already registered');
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const avatarURL = gravatar.url(email, { protocol: "https" });
	const verificationToken = crypto.randomUUID();

	const newUser = await User.create({ email, password: hashPassword, avatarURL, verificationToken, });


	await sendMessage({
		to: SENDER_MAIL,
		subject: "To verify your email",
		html: `
		<p>To confirm your registration, please click on link below</p>
		<p>
		  <a href='http://localhost:${PORT}/api/users/verify/${verificationToken}'>Follow me</a>
		</p>`,
		text: `
		To confirm your registration, please click on link below\n
		http://localhost:${PORT}/api//users/verify/${verificationToken}
		`,

	})

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};

module.exports = registerUser;