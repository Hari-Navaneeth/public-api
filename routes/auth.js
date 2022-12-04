// import fetch from "node-fetch";
const express = require("express");
const User = require("../models/users");
const Otp = require("../models/otp");
const router = express.Router();
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { differenceInDays, differenceInMinutes } = require("date-fns");
const otpGenerator = require("otp-generator");
// const fetchApi = require("node-fetch");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const apikey = "NjgzODc4NTg1MzZmNDE3YTU1NzY0NTU3NDc3NTQyNGY=";

const JWT_SECRET_KEY = "Secret1234";
const getExpiresIn = () => {
  const todayDateTime = new Date();
  const today = new Date(
    todayDateTime.getFullYear(),
    todayDateTime.getMonth(),
    todayDateTime.getDate()
  );
  const lastDateOf2022 = new Date(2023, 0, 0);
  if (todayDateTime < lastDateOf2022) {
    const difference = differenceInDays(lastDateOf2022, today);
    console.log("difference", difference);
    return `${difference}d`;
  }
  const tillDate = new Date();
  tillDate.setMonth(tillDate.getMonth() + 6);
  const difference = differenceInDays(lastDateOf2022, today);
  console.log("difference", difference);
  return `${difference}d`;
};

// router.get("/otp", async (req, res) => {
//   const url = `https://api.textlocal.in/send/?apikey=${apikey}&numbers=${919600905626}&sender=TXTLCL&message=${encodeURIComponent(
//     "Test Message"
//   )}`;
//   axios
//     .get(url)
//     .then(function (response) {
//       // handle success
//       console.log("------ SMS Gateway Response ------");
//       console.log(response.data);
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
//     .finally(function () {
//       // always executed
//     });
//   res.status(200).json({ res: {} });
// });

// router.post("/user", async (req, res, next) => {
//   try {
//     req.body.email = req.body.email.toLowerCase();
//     User.find({ email: req.body.email }, async (err, user) => {
//       if (user && user.length > 0) {
//         res.status(409).send({ message: "user already exist." });
//       } else {
//         const {
//           firstName,
//           lastName,
//           profession,
//           email,
//           password,
//           school,
//           artTeacher,
//           class: studentClass,
//           dateOfBirth,
//           district,
//         } = req.body;
//         req.body.password = cryptoJS.MD5(req.body.password);
//         const newUser = {
//           firstName,
//           lastName,
//           profession,
//           email,
//           password: cryptoJS.MD5(password),
//           school,
//           artTeacher,
//           class: studentClass,
//           dateOfBirth,
//           district,
//           createdAt: new Date(),
//         };
//         const user = new User(newUser);
//         await user.save();
//         const token = jwt.sign({ name: user._id.toString() }, "Secret1234", {
//           expiresIn,
//         });
//         res.status(201).json({
//           success: true,
//           message: "Logged In",
//           token,
//           user,
//         });
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// });
router.post("/user", async (req, res, next) => {
  try {
    req.body.mobile = req.body.mobile.toLowerCase();
    User.find({ mobile: req.body.mobile }, async (err, user) => {
      if (user && user.length > 0) {
        res.status(409).send({ message: "user already exist." });
      } else {
        const {
          firstName,
          lastName,
          // profession,
          mobile,
          password,
          // school,
          // artTeacher,
          // class: studentClass,
          // dateOfBirth,
          // district,
        } = req.body;
        req.body.password = cryptoJS.MD5(req.body.password);
        const newUser = {
          firstName,
          lastName,
          // profession,
          mobile,
          password: cryptoJS.MD5(password),
          // school,
          // artTeacher,
          // class: studentClass,
          // dateOfBirth,
          // district,
          createdAt: new Date(),
        };
        const user = new User(newUser);
        await user.save();
        const token = jwt.sign({ name: user._id.toString() }, JWT_SECRET_KEY, {
          expiresIn: getExpiresIn(),
        });
        res.status(201).json({
          success: true,
          message: "Logged In",
          token,
          user,
        });
      }
    });
  } catch (err) {
    next(err);
  }
});

// router.post("/", function (req, res) {
//   console.log("req.body", req.body);
//   console.log("req.query", req.query);
//   var email = (req.body.email || req.query.email || "").toLowerCase();
//   var pwd = cryptoJS.MD5(
//     req.body.password || req.query.password || ""
//   ).toString();
//   User.findOne({ email }, function (err, user) {
//     console.log("user", user);
//     if (err) throw err;
//     if (!user) {
//       res.json({
//         success: false,
//         message: "Authentication failed. User not found",
//       });
//     } else if (user) {
//       if (user.password !== pwd) {
//         res.json({
//           success: false,
//           message: "Authentication failed. Wrong password",
//         });
//       } else {
//         const token = jwt.sign({ name: user._id.toString() }, "Secret1234", {
//           expiresIn,
//         });
//         res.status(200).json({
//           success: true,
//           message: "Logged In",
//           token,
//           user,
//         });
//         // res.setHeader("x-access-token", token).status(200).json({
//         //   success: true,
//         //   message: "Logged In",
//         //   token,
//         //   user,
//         // });
//       }
//     }
//   });
// });
router.post("/", function (req, res) {
  console.log("req.body", req.body);
  console.log("req.query", req.query);
  const mobile = req.body.mobile || req.query.mobile || "";
  const password = cryptoJS
    .MD5(req.body.password || req.query.password || "")
    .toString();
  User.findOne({ mobile }, function (err, user) {
    console.log("user", user);
    if (err) throw err;
    if (!user) {
      res.json({
        success: false,
        message: "Authentication failed. User not found",
      });
    } else if (user) {
      if (user.password !== password) {
        res.json({
          success: false,
          message: "Authentication failed. Wrong password",
        });
      } else {
        const token = jwt.sign({ name: user._id.toString() }, JWT_SECRET_KEY, {
          expiresIn: getExpiresIn(),
        });
        res.status(200).json({
          success: true,
          message: "Logged In",
          token,
          user,
        });
        // res.setHeader("x-access-token", token).status(200).json({
        //   success: true,
        //   message: "Logged In",
        //   token,
        //   user,
        // });
      }
    }
  });
});

router.post("/otp", function (req, res) {
  const mobile = req.body.mobile || req.query.mobile || "";
  User.findOne({ mobile }, async function (err, user) {
    console.log("user", user);
    if (err) throw err;
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      const otpExpiresAt = new Date();
      otpExpiresAt.setHours(otpExpiresAt.getHours() + 1);
      const baseUrl = "https://api.textlocal.in/send/";
      const msg = `Dear User, Your OTP for pynemonk.com is ${otp} Kindly Use this Passcode \nto Login.`;
      const url = `${baseUrl}?apikey=NjU1MTQ5NTUzODM4NTU2MzQ1NTc0MTc5MzY0NjMyNjk=&numbers=${mobile.slice(
        2
      )}&sender=PNMONK&message=${encodeURIComponent(msg)}`;
      await fetch(url);
      await Otp.updateOne(
        {
          userId: user._id,
        },
        {
          otp,
          verified: false,
          expiresAt: otpExpiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { upsert: true }
      );
      res.json({
        success: true,
        message: "Otp has sent to your registered mobile number",
      });
    }
  });
});

router.post("/verify-forgot-password-otp", function (req, res) {
  const mobile = req.body.mobile || req.query.mobile || "";
  const otp = req.body.otp || req.query.otp || "";
  User.findOne({ mobile }, async function (err, user) {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else if (user) {
      const otpDetails = await Otp.findOne({ userId: user._id });
      console.log("otpDetails", otpDetails);
      if (otpDetails.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Wrong OTP",
        });
      } else if (
        differenceInMinutes(new Date(otpDetails.expiresAt), new Date()) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "OTP expired",
        });
      } else {
        await Otp.updateOne(
          {
            userId: user._id,
          },
          {
            otp,
            verified: true,
            updatedAt: new Date(),
          },
          { upsert: true }
        );
        res.status(200).json({
          success: true,
          message: "OTP verification success",
        });
      }
    }
  });
});

router.post("/reset-password", function (req, res) {
  const mobile = req.body.mobile || req.query.mobile || "";
  const otp = req.body.otp || req.query.otp || "";
  const password = cryptoJS
    .MD5(req.body.password || req.query.password || "")
    .toString();
  User.findOne({ mobile }, async function (err, user) {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else if (user) {
      const otpDetails = await Otp.findOne({ userId: user._id });
      if (otpDetails.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Wrong OTP",
        });
      } else if (
        differenceInMinutes(new Date(otpDetails.expiresAt), new Date()) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "OTP expired",
        });
      } else {
        await User.updateOne(
          {
            _id: user._id,
          },
          {
            password,
          }
        );
        await Otp.deleteMany({
          userId: user._id,
          otp,
        });
        res.status(200).json({
          success: true,
          message: "Password changed successfully",
        });
      }
    }
  });
});

router.post("/logout", function (req, res) {
  delete req.body.token;
  res.status(200).send("user logged out");
});

module.exports = router;
