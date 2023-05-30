const Joi = require("joi");

const signUpBodyValidation = async (req, res, next) => {
  console.log("body");
  const body = req.body;
  try {
    console.log("BODYYY");
    const result = Joi.object({
      password: Joi.string().min(8).max(20).required(),
      // phoneNumber: Joi.string().required().regex(/^[789]\d{9}$/),
      email: Joi.string().required().email(),
      // .regex(/^[\w!.%+\-]+@[\w\-]+(?:\.[\w\-]+)+$/)
      confirmPassword: Joi.string().min(8).max(20).required(),
      userName: Joi.string().required().min(4).max(15),
      blockChainAddress: Joi.string(),
      docHash:  Joi.array(),
      
    });
    const validation = result.validate(body);

    if (validation.error) {
      res
        .status(401)
        .json({ status: "fail", message: validation.error.details });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
module.exports = signUpBodyValidation;
