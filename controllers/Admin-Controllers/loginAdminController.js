const adminSchema = require("../../models/adminSchema");

exports.loginAdminController = async (req, res) => {
  
  const { email, userName, password } = req.body;

  try {
    
    let token = req.cookies.auth;
    await adminSchema.findByToken(token, async (err, admin) => {
      if (err) {
        return res(err);
      }
      if (admin) {
        return res.status(400).json({
          error: true,
          message: "You are already logged in",
        });
      } else {
        const admin = await adminSchema.findOne(
          { $or: [{ email: email }, { userName: userName }] })
          // async (err, admin) =>{
            if (!admin){
              return res.json({
                isAuth: false,
                message: " Auth failed ,email / phone number not found",
              });
            }else{
              await admin.comparepassword(password, async(err, isMatch) => {
                console.log(admin,"admin")
                if (!isMatch)
                  return res.json({
                    isAuth: false,
                    message: "password doesn't match",
                  });
  
               await admin.generateToken((err, admin) => {
                  if (err) return res.status(400).send(err);
                  res.cookie("auth", admin.token).json({
                    isAuth: true,
                    id: admin._id,
                    email: admin.email,
                  });
                });
              });
            }
           
          // }
        // );
      }
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
