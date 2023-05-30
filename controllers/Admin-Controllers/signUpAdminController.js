const admin = require("../../models/adminSchema");

exports.signUpAdminController = async(req,res)=>{

    const { email, password, confirmPassword, userName } =
      req.body;

    try {
      
      if(password != confirmPassword){
        res
          .status(401)
          .send({ status: false, message: "Confirm Password and Password do not match" });
          return;
      }else{
      const adminExist = await admin.findOne({ email: email });
      if (adminExist) {
        res
          .status(409)
          .send({ status: false, message: "admin Already Exists!!" });
        return;
      }

      const newCreatedadmin = await admin.create({
        email,
        password,
        userName
      })
      const newadmin = await newCreatedadmin.save();

      res.status(200).json({ status: true, result: "admin Created" });
    }
  // };

    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ status: false, message: err.message });
    }
}