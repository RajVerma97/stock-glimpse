
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken:{
      type:String,
    },
    resetPasswordExpires:{
      type:Date,
    }
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

 export default User;
