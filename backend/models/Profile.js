import mongoose from "mongoose";
const { Schema } = mongoose;

const educationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String },
  fieldOfStudy: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
  currentlyStudying: { type: Boolean, default: false }
}, { _id: false });

const workSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false }
}, { _id: false });

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  bio: {
    type: String,
    maxlength: 500,
  },

  currentPosition: {
    type: String,  
  },

  education: [educationSchema],

  work: [workSchema],

}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
