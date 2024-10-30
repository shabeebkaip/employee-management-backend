import User from "../model/user.js";

const validateEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email, mobile number, and country code are required.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const emailExists = await User.findOne({ "basicDetails.email": email });
  if (emailExists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  next();
};

export { validateEmail };
