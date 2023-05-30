const Joi = require('joi')

const loginBodyValidation = async(req,res,next) => {
  const body = req.body
  try{
    const result = Joi.object({
    password: Joi
      .string()
      .min(8)
      .max(20)
      .required(),
    // phoneNumber: Joi.string().regex(/^[789]\d{9}$/),
    email: Joi
      .string().email(),
    userName:Joi.string().required().min(4).max(15),
    })
    const validation = result.validate(body)

    if(validation.error){
      res.status(400).json({status: "fail", message: validation.error.details})
    }else{
      next()
    }
  }catch(err){
    res.status(500).json({status: "fail", message: err.message})
  }
}
module.exports = loginBodyValidation

// module.exports = {
//   loginValidator: () => {
//     return [
//       check("email", "please provide valid email").normalizeEmail().isEmail(),
//       check(
//         "password",
//         "please provide a minimum 6 char long password !! "
//       ).isLength({ min: 6 }),
//     ];
//   },

//   signupValidator: () => {
//     return [
//       check("email", "please provide valid email !!")
//         .normalizeEmail()
//         .isEmail(),
//       check(
//         "password",
//         "please provide a minimum 6 char long password !! "
//       ).isLength({ min: 6 }),
//       check(
//         "confirmPassword",
//         "please provide a minimum 6 char long password !! "
//       ).isLength({ min: 6 }),
//       check("role", "please provide role !!").notEmpty(),
//       check("companyName", "please provide companyName !!").notEmpty(),
//       check("isAgree", "isAgree value not provide !!").isBoolean(),
//     ];
//   },
// };
