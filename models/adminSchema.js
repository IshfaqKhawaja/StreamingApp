const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
   {
      userName: {
         type: String,
         unique: true,
         required: true
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
      valid: "Admin"
    }
   },
   { timestamps: true, collection: 'Admins' }
);

// pre-save function to hash password
adminSchema.pre("save", function (next) {
    var admin = this;
  
    if (admin.isModified("password")) {
      bcrypt.genSalt(salt, function (err, salt) {
        if (err) return next(err);
  
        bcrypt.hash(admin.password, salt, function (err, hash) {
          if (err) return next(err);
          admin.password = hash;
          admin.password2 = hash;
          next();
        });
      });
    } else {
      next();
    }
  });
  
  // compare password
  adminSchema.methods.comparepassword = function (password, cb) {
     var admin = this;
     // let a = bcrypt.hash(password,10)
    bcrypt.compare(password, admin.password, function (err, isMatch) {
     // console.log(password, admin.password, a, "HIIIIIII")
      if (err) return cb(next);
      cb(null, isMatch);
    });
  };
  
  // generate token
  adminSchema.methods.generateToken = function (cb) {
    var admin = this;
    var token = jwt.sign(admin._id.toHexString(), process.env.SECRET);
  
    admin.token = token;
    admin.save(function (err, admin) {
      if (err) return cb(err);
      cb(null, admin);
    });
  };
  
  // find by token
  adminSchema.statics.findByToken = function (token, cb) {
    var admin = this;
  
    jwt.verify(token, process.env.SECRET, function (err, decode) {
      admin.findOne({ _id: decode, token: token }, function (err, admin) {
        if (err) return cb(err);
        cb(null, admin);
      });
    });
  };
  
  //delete token
  adminSchema.methods.deleteToken = function (token, cb) {
    var admin = this;
  
    admin.update({ $unset: { token: 1 } }, function (err, admin) {
      if (err) return cb(err);
      cb(null, admin);
    });
  };

  module.exports = mongoose.model("admin", adminSchema);