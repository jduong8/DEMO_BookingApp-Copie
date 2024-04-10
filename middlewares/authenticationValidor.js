const { body, validationResult } = require("express-validator");

exports.signUpValidationRules = () => {
  return [
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("L'email n'est pas au bon format"),
    body("user_password")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
    body("firstname").not().isEmpty().withMessage("Le prénom est obligatoire"),
    body("lastname").not().isEmpty().withMessage("Le nom est obligatoire"),
  ];
};

exports.signInValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Le format de l'email est incorrect"),
    body("user_password")
      .isLength({ min: 5 })
      .withMessage("Le mot de passe doit contenir au moins 5 caractères"),
  ];
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
