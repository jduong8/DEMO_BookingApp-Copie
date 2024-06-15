const AuthenticationService = require("../services/authentication.service.js");
const authService = new AuthenticationService();

exports.signUp = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error) {
    res.status(422).json({ message: "Cannot registrer", error });
  }
};

exports.connect = async (req, res) => {
  try {
    const user = await authService.valideUser(
      req.body.email,
      req.body.password,
    );

    const token = await authService.generateToken(user);
    res.json({
      message: "Connexion succeed",
      token: token,
    });
  } catch {
    return res.status(400).json({ message: "Incorrect user or password" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body.email);
    res.status(200).json({ message: "Email sent for reset password" });
  } catch {
    res.status(422).json({ message: "Cannot send email for reset password" });
  }
};
