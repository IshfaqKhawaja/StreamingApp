const router = require("express").Router();
const fs = require('fs');

const multer = require('multer');
const upload = multer();

console.log("HEEEE")
const {auth} =require('../utils/auth');

const loginBodyValidation = require("../middleware/loginBodyValidation");
const signUpBodyValidation = require("../middleware/signUpBodyValidation")
const signUpUserController = require("../controllers/User-Controllers/signUpUserController");
const loginUserController = require("../controllers/User-Controllers/loginUserController");

const uploadFileController = require("../controllers/uploadFileController")

// sign-up user
router.post("/signUp", signUpBodyValidation,async (req,res)=>{
  console.log("signUpController")
  signUpUserController.signUpUserController(req,res)
})

// login user
router.post("/login", [loginBodyValidation, auth], (req,res)=>{
    loginUserController.loginUserController(req,res)
});

// get logged in user
router.get('/profile',auth,async(req,res)=>{
  res.json({
      isAuth: true,
      id: req.user._id,
      email: req.user.email,
      name: req.user.firstname + req.user.lastname    
  })
});

router.post('/uploadFile', upload.single('file'), async (req, res)=>{
  uploadFileController.uploadFileController(req,res)
})

// logout user
router.get('/logout', auth, async (req,res)=>{
  req.user.deleteToken(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.sendStatus(200);
  });

  // Upload file to IPFS Controller

}); 

module.exports = router;