const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");


const verify = async (req, res, next) => {
	const { verificationToken } = req.params;

	try {
		const user = await User.findOne({ verificationToken });
		if (user === null) {
			throw HttpError(404, "User not found");
		}
		await User.findByIdAndUpdate(user._id, {
			verify: true,
			verificationToken: null,
		});
		res.json({ message: "Verification successful" });
	} catch (error) {
		next(error);
	}
};
module.exports = verify;