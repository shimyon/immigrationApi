const asyncHandler = require('express-async-handler')
const followUpModel = require('../models/followUpModel')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;
const StatusModal = StudentModal.StautsModal;



const getdashboardDetails = asyncHandler(async (req, res) => {
    try {
        let result = {
            studentCount: 0,
            followUpCount: 0,
            status: {}
        };
        result.studentCount = await getStudentCount(req);
        result.followUpCount = await getFollowUpCount(req);
        result.status = await getStatusAllCount(req);

        res.status(200).json({
            success: true,
            msg: '',
            data: result,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
})

const getStudentCount = (req) => {
    return new Promise((resolve, reject) => {
        let filter = {};
        if (req.user.role == 'Manager') {
            filter = { assignedManager: req.user._id, ...filter };
        } else if (req.user.role == 'Receptionist') {
            filter = { assignedManager: { $eq: null }, assignedManagerRequest: { $eq: null }, ...filter };
        }
        Student.countDocuments({}, (err, countstudent) => {
            resolve(countstudent);
        })
    });
}

const getFollowUpCount = (req) => {
    return new Promise((resolve, reject) => {
        followUpModel.countDocuments({}, (err, countstudent) => {
            resolve(countstudent);
        })
    });
}

const getStatusAllCount = (req) => {
    return new Promise(async (resolve, reject) => {
        let allstatus = await StatusModal.find({}).lean();
        let statusObj = {};
        for (let index = 0; index < allstatus.length; index++) {
            const status = allstatus[index];
            const statusName = status.statusName;
            let statuscount = 0;
            await getStatus(req, status._id).then(val => {
                statuscount = val;
            }).catch((error) => {
                debugger
            })
            statusObj[statusName] = statuscount;
        }
        resolve(statusObj);
    });
}

const getStatus = (req, statudid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let filter = { status: statudid };
            if (req.user.role == 'Manager') {
                filter = { assignedManager: req.user._id, ...filter };
            } else if (req.user.role == 'Receptionist') {
                filter = { assignedManager: { $eq: null }, assignedManagerRequest: { $eq: null }, ...filter };
            }
            Student.countDocuments(filter, (err, countstudent) => {
                resolve(countstudent);
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { getdashboardDetails }