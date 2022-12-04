const express = require("express");
const User = require("../models/users");
const Participant = require("../models/participants");
const District = require("../models/districts");
const School = require("../models/schools");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    const participants = await Participant.find();
    const districts = await District.find();
    const schools = await School.find();
    const participantDetails = [];
    const nonParticipantDetails = [];
    const getSchoolName = (id) => {
      const result = schools.filter(({ _id }) => String(_id) === String(id));
      if (result.length > 0) return result[0].schoolName;
      return "";
    };
    // const getDistrict = (id) => {
    //   const result = districts.filter(({ _id }) => String(_id) === String(id));
    //   if (result.length > 0) return result[0].district;
    //   return "";
    // };
    users.forEach(({ _id, firstName, lastName, mobile }) => {
      const result = participants.filter(({ userId }) => String(_id) === String(userId));
      if (result.length > 0) {
        const {
          studentName,
          class: studentClass,
          attachment,
          school,
          district,
        } = result[0];
        participantDetails.push({
          userId: _id,
          name: [firstName, lastName].join(" "),
          mobile:String(mobile).slice(2),
          studentName,
          studentClass,
          attachment,
          school: getSchoolName(school),
          district,
        });
      } else {
        nonParticipantDetails.push({
          userId: _id,
          name: [firstName, lastName].join(" "),
          mobile:String(mobile).slice(2),
        });
      }
    });
    return res.status(200).json({ participantDetails, nonParticipantDetails });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
