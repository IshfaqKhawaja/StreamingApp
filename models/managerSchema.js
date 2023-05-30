const mongoose = require("mongoose");

const managerSchema = mongoose.Schema(
   {
      managerName: {
         type: String,
         unique: true,
        //  required: true
      },
      email: {
        type: String,
        unique: true,
        reuired: true
     },
     phoneNumber: {
       type: String,
       required: true
    },
     password: {
        type: String,
        required: true
     },
     coinBalance: {
       type: String,
       required: true
    },
    token: {
     type: String
    },
    role:{
      type: String,
      required: true,
      valid: "Manager"
    }
   },
   { timestamps: true, collection: 'managers' }
);

// pre-save function to hash password
managerSchema.pre("save", function (next) {
    var manager = this;
  
    if (manager.isModified("password")) {
      bcrypt.genSalt(salt, function (err, salt) {
        if (err) return next(err);
  
        bcrypt.hash(manager.password, salt, function (err, hash) {
          if (err) return next(err);
          manager.password = hash;
          manager.password2 = hash;
          next();
        });
      });
    } else {
      next();
    }
  });
  
  // compare password
  managerSchema.methods.comparepassword = function (password, cb) {
     var manager = this;
     // let a = bcrypt.hash(password,10)
    bcrypt.compare(password, manager.password, function (err, isMatch) {
     // console.log(password, manager.password, a, "HIIIIIII")
      if (err) return cb(next);
      cb(null, isMatch);
    });
  };
  
  // generate token
  managerSchema.methods.generateToken = function (cb) {
    var manager = this;
    var token = jwt.sign(manager._id.toHexString(), process.env.SECRET);
  
    manager.token = token;
    manager.save(function (err, manager) {
      if (err) return cb(err);
      cb(null, manager);
    });
  };
  
  // find by token
  managerSchema.statics.findByToken = function (token, cb) {
    var manager = this;
  
    jwt.verify(token, process.env.SECRET, function (err, decode) {
      manager.findOne({ _id: decode, token: token }, function (err, manager) {
        if (err) return cb(err);
        cb(null, manager);
      });
    });
  };
  
  //delete token
  managerSchema.methods.deleteToken = function (token, cb) {
    var manager = this;
  
    manager.update({ $unset: { token: 1 } }, function (err, manager) {
      if (err) return cb(err);
      cb(null, manager);
    });
  };

  module.exports = mongoose.model("manager", managerSchema);
  