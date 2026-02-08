import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from '../backend/routers/posts.routes.js'
import userRouter from'../backend/routers/user.routes.js'
import User from "./models/User.js"; // Adjust path as needed

//password 
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";

 

//Passport config with custom LocalStrategy specifying usernameField as 'Email'
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;






dotenv.config();

const app = express();

//set in connect 
app.set("port",(process.env.PORT||8080))
app.set("mongo_user",process.env.MONGO_URL);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Session config (before routes)
app.use(session({
    secret:process.env.SECRET, // use dotenv in prod
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField: 'Email',    // Important: specify email as usernameField
    passwordField: 'Password'  // Specify password field if you want (optional)
  },
  User.authenticate()
));

// Passport config

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.all("*", (req, res, next) => {
//   const error = new Error("Page Not Found");
//   error.status = 404;
//   next(error);
// });


// 🔹 Serve uploads folder as static (important!)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/post', postRoutes);
app.use('/',userRouter);

  app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
connectDB();
    
  });
  
const connectDB = async () => {
  try {
      const mongoURL = app.get("mongo_user");
    if (!mongoURL) throw new Error("MONGO_URL is not defined");

    await mongoose.connect(mongoURL); 
    
    console.log(" successfully connected with database");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};