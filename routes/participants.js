const express = require("express");
const User = require("../models/users");
const Participant = require("../models/participants");
const router = express.Router();

router.post("/", async (req, res, next) => {
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
    const token = req.decoded;
    const userId = token.name;
    const {
      competitionId = "636aa68e8b11c7d04c4f2cc8",
      studentName,
      district,
      school,
      class: studentClass,
      attachment,
      createdAt = new Date(),
    } = req.body;
    Participant.findOne({ userId,competitionId }, async (err, participant) => {
      if (participant) {
        res.status(409).send({ message: "User entry already exist." });
      } else {
        const newParticipant = {
            userId,
            competitionId,
            studentName,
            district,
            school,
            class: studentClass,
            attachment,
            createdAt,
        };
        const participant = new Participant(newParticipant);
        await participant.save();
        res.status(200).json({
          success: true,
          message: "Registered successfully",
        });
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;