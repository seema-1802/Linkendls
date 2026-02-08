import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
    },
  
  Name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  
//   ProfileImage: {
//     type: String,  
//     default: "",   
//  },
  ProfileImage: {
  type: String,
  default: function() {
    if (this.Name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.Name)}&background=random&color=fff&size=128`;
    }
    return "";
  }
},

  CreatedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: 'Email' });


const User = mongoose.model("User", userSchema);

export default User;