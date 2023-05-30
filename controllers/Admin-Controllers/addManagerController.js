const adminSchema = require("../../models/adminSchema");
const managerSchema = require("../../models/managerSchema")

exports.addManagerController = async (req, res) => {
  const { email, password, confirmPassword, userName } = req.body;

  try {
    let token = req.cookies.auth;
    await adminSchema.findByToken(token, async (err, admin) => {
      if (err) {
        return res(err);
      }
      if (admin) {
        const manager = await managerSchema.findOne({
          $or: [{ email: email }, { userName: userName }],
        });
        // async (err, admin) =>{
        if (manager) {
          return res.json({
            status: "",
            message: "Manager already Exists!",
          });
        } else {
          if (password === confirmPassword) {
            await managerSchema.create(
              { email, password, userName },
              async (err, data) => {
                if (data) {
                  res.status(200).json({
                    status: "success",
                    message: "Manager Created",
                    data: data,
                  });
                } else {
                  res.status(400).json({
                    status: "FAIL",
                    message: "Manager creation failed",
                  });
                }
              }
            );
          } else {
            res.status(404).json({
              status: "FAIL",
              message: "Password and Confirm Password do not match",
            });
          }
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
