const managerSchema = require("../../models/managerSchema");

exports.loginManagerController = async (req, res) => {
  
  const { email, userName, password } = req.body;

  try {
    
    let token = req.cookies.auth;
    await managerSchema.findByToken(token, async (err, manager) => {
      if (err) {
        return res(err);
      }
      if (manager) {
        return res.status(400).json({
          error: true,
          message: "You are already logged in",
        });
      } else {
        const manager = await managerSchema.findOne(
          { $or: [{ email: email }, { userName: userName }] })
          // async (err, manager) =>{
            if (!manager){
              return res.json({
                isAuth: false,
                message: " Auth failed ,email / phone number not found",
              });
            }else{
              await manager.comparepassword(password, async(err, isMatch) => {
                console.log(manager,"manager")
                if (!isMatch)
                  return res.json({
                    isAuth: false,
                    message: "password doesn't match",
                  });
  
               await manager.generateToken((err, manager) => {
                  if (err) return res.status(400).send(err);
                  res.cookie("auth", manager.token).json({
                    isAuth: true,
                    id: manager._id,
                    email: manager.email,
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
