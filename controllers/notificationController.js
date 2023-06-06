const { ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler')
const notificationModel = require('../models/notificationModel')
const addNotification = asyncHandler(async (req, res) => {
    try {
        const savedNotification = await notificationModel.create({
            description: req.body.description,
            date: req.body.date,
            userId: req.body.userId,
            Isread: req.body.Isread
        });
        if (savedNotification) {
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
const editNotification = asyncHandler(async (req, res) => {
    try {
        let updatecount = await notificationModel.findByIdAndUpdate(req.body.Id, {
            description: req.body.description,
            date: req.body.date,
            userId: req.body.userId,
            Isread: req.body.Isread
        });
        res.status(200).json({
            success: true,
            msg: "updated data successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating status. " + err.message,
            data: null,
        });
    }
})

const deleteNotification = asyncHandler(async (req, res) => {
    try {
        const studentId = req.body.studentId;
        // var deleteExpstud = await Student.findByIdAndUpdate(
        //     studentId, { $pull: { workExperience: req.body.workExperianceId } }
        // )

        var deleteexp = await notificationModel.findByIdAndDelete(req.body.notificationId)
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
const getAllNotification = asyncHandler(async (req, res) => {
    try {
        const notification = await notificationModel.find().sort('step');

        res.status(200).json(notification).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

const getAllNotificationByUId = asyncHandler(async (req, res) => {
    try {
        // const userExists = await User.findOne({ _id: id });

        const notification = await notificationModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            msg: "",
            data: notification,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

const setmarkasread = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        const notification = await notificationModel.findByIdAndUpdate(id, { Isread: true });

        res.status(200).json({
            success: notification != null,
            msg: "",
            data: notification,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

const getMostRecentById = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;
        const notification = await notificationModel.find({ userId, Isread: false }).limit(3).sort({ createdAt: -1 });
        const count = await notificationModel.countDocuments({ userId, Isread: false }).exec();
        res.status(200).json({
            success: true,
            msg: "",
            data: {
                notification,
                count 
            },
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})
module.exports = { addNotification, editNotification, deleteNotification, getAllNotification, getAllNotificationByUId, setmarkasread, getMostRecentById }



