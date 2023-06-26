const asyncHandler = require('express-async-handler')
const followUpModel = require('../models/followUpModel')
const followUp = followUpModel.followUpModel;
const moment = require('moment');

const addFollowUp = asyncHandler(async (req, res) => {
    try {
        const savedfollowup = await followUpModel.create({
            userId: req.user.id,
            date: req.body.date,
            studentId: req.body.studentId,
            remark: req.body.remark
        });
        if (savedfollowup) {
            res.status(201).json({
                success: true,
                message: "Data added successfully."
            }).end()
        }
        else {
            res.status(400)
            throw new Error("Invalid data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
});
const editFollowUp = asyncHandler(async (req, res) => {
    try {
        let updatecount = await followUpModel.findByIdAndUpdate(req.body.id, {
            date: req.body.date,
            studentId: req.body.studentId,
            remark: req.body.remark
        });
        res.status(200).json({
            success: true,
            msg: "updated  data successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating status. " + err.message,
            data: null,
        });
    }
})

const deleteFollowUp = asyncHandler(async (req, res) => {
    try {
        const studentId = req.body.studentId;
        // var deleteExpstud = await Student.findByIdAndUpdate(
        //     studentId, { $pull: { workExperience: req.body.workExperianceId } }
        // )

        var deleteexp = await followUpModel.findByIdAndDelete(req.body.followUpId)
        res.status(201).json({
            message: "delete successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }

})

const getFollowupList = async (req, res) => {
    try {
        const body = { ...req.body };
        const today = moment().startOf('day');
        let filter = { userId: req.user.id };
        if (body.tense == "future") {
            filter.date = {
                $gte: moment(today).endOf('day').toDate()
            };
        } else if (body.tense == "past") {
            filter.date = {
                $lte: today.toDate()
            };
        } else {
            filter.date = {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            };
        }
        let followUp = await followUpModel.find(filter).populate('studentId', '_id name mobileNumber email visaApplyCountry photo');
        res.status(200).json({
            success: true,
            message: "",
            data: followUp
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting followup list. " + err.message,
            data: null,
        });
    }
}

const getFollowupById = async (req, res) => {
    try {
        let followUp = await followUpModel.findById(req.params.id);
        res.status(200).json(followUp).end();
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting followup list. " + err.message,
            data: null,
        });
    }
}

module.exports = { addFollowUp, editFollowUp, deleteFollowUp, getFollowupList, getFollowupById }