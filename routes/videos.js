require("dotenv").config();
const express = require("express");
const router = express.Router();

const ACCESS_KEY = process.env.ACCESS_KEY;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REGION = process.env.REGION;
const BUCKET = process.env.BUCKET;

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const Video = require("../models/videos");
const { v4: uuidV4 } = require("uuid");

const CATEGORIES = ["kids_art", "calligraphy", "biology"];
const CATEGORY_LABELS = {
  kids_art: "Kid's Art",
  calligraphy: "Calligraphy",
  biology: "Biology",
};

aws.config.update({
  secretAccessKey: ACCESS_SECRET,
  accessKeyId: ACCESS_KEY,
  region: REGION,
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      // const apiToken =
      //   req.body.token || req.query.token || req.headers["x-access-token"];
      // if (apiToken) {
      //   jwt.verify(apiToken, "Secret1234", function (err, decoded) {
      //     if (err) {
      //       return res.status(401).send({
      //         success: false,
      //         message: "Failed to authenticate token.",
      //       });
      //     } else {
      //       req.decoded = decoded;
      //     }
      //   });
      // }
      const token = req.decoded;
      const userId = token.name;
      const uuid = uuidV4();
      const newFileName = `${userId}/${uuid}/${file.originalname}`;
      cb(null, newFileName);
    },
  }),
});

router.post("/upload", upload.single("file"), (req, res) => {
  // const apiToken =
  //   req.body.token || req.query.token || req.headers["x-access-token"];
  // if (apiToken) {
  //   jwt.verify(apiToken, "Secret1234", function (err, decoded) {
  //     if (err) {
  //       return res.status(401).send({
  //         success: false,
  //         message: "Failed to authenticate token.",
  //       });
  //     } else {
  //       req.decoded = decoded;
  //     }
  //   });
  // } else {
  //   return res.status(403).send({
  //     success: false,
  //     message: "please provide the token",
  //   });
  // }
  res.status(200).json({
    // location: req.file.location,
    // fileName: req.file.filename,
    // url: `https://d2tthb50shid3p.cloudfront.net/${req.file.originalname}`,
    location: req.file.location,
    fileName: req.file.filename,
    result: `https://d2tthb50shid3p.cloudfront.net/${req.file.key}`,
    message: "File Uploaded successfully",
  });
});
router.get("/", (req, res, next) => {
  try {
    // const apiToken =
    //   req.body.token || req.query.token || req.headers["x-access-token"];
    // if (apiToken) {
    //   jwt.verify(apiToken, "Secret1234", function (err, decoded) {
    //     if (err) {
    //       return res.status(401).send({
    //         success: false,
    //         message: "Failed to authenticate token.",
    //       });
    //     } else {
    //       req.decoded = decoded;
    //     }
    //   });
    // } else {
    //   return res.status(403).send({
    //     success: false,
    //     message: "please provide the token",
    //   });
    // }
    Video.find((err, data) => {
      const result = [];
      if (data.length > 0) {
        const freeVideosResult = data.filter(({ _doc: { free } }) => free);
        // console.log(
        //   "freeVideosResult",
        //   freeVideosResult.length,
        //   freeVideosResult
        // );
        if (freeVideosResult && freeVideosResult.length > 0) {
          const label = "Free Trending Videos";
          result.push({
            label,
            videos: freeVideosResult,
            autoPlay: true,
            playable: true,
          });
        }
        const trendingResult = data.filter(({ trending }) => trending);
        // console.log("trendingResult", trendingResult.length, trendingResult);
        if (trendingResult && trendingResult.length > 0) {
          const label = "Trending";
          result.push({ label, videos: trendingResult, autoPlay: true });
        }
        CATEGORIES.forEach((category) => {
          const label = CATEGORY_LABELS[category];
          const videos = data.filter(
            ({ category: videoCategory }) => videoCategory === category
          );
          if (videos.length > 0) result.push({ label, videos });
        });
      }
      res.status(200).send(result);
    });
  } catch (error) {
    next(error);
  }
  // try {
  //     let temp_arr = [];
  //     Video.find((err, data) => {
  //         if (req.query.category) {
  //             console.log(req.query.category);
  //             if (req.query.category) {
  //                 for (const video_obj of data) {
  //                     if (video_obj.category === req.query.category) temp_arr.push(video_obj);
  //                     // let value = video_obj.category.indexOf(req.query.category) + 1
  //                     // if (value) temp_arr.push(video_obj);
  //                 }
  //                 res.status(200).send(temp_arr);
  //             }
  //         } else {
  //             let new_data;
  //             let new_data2 = []
  //             let videoName;
  //             let videoLink;
  //             let obj = {
  //                 "label": "kids_art",
  //                 "videos": []
  //             }
  //             Video.find((err, data) => {
  //                 if (err) return next(err);
  //                 else {
  //                     new_data = data.map(({ category, videoName, videoLink }) => (
  //                         { "label": category, "videoName": videoName, "videoLink": videoLink }
  //                     ))
  //                     // for (let i = 0; i < new_data.length; i++) {
  //                     //     if(new_data[i].label === "kids_art"){
  //                     //         videoName = new_data[i].videoName,
  //                     //         videoLink = new_data[i].videoLink
  //                     //         obj.videos.push({"video name": videoName, "video link": videoLink})
  //                     //     }
  //                     //     new_data2.push(obj);
  //                     // }
  //                 }
  //                 // console.log("new_data2====", new_data2);
  //                 res.status(200).send(new_data);
  //             })
  //         }
  //     })
  // } catch (error) {
  //     next(error)
  // }
});

module.exports = router;
