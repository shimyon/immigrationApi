const asyncHandler = require('express-async-handler')
const followUpModel = require('../models/followUpModel')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;



const getdashboardDetails = asyncHandler(async (req, res) => {
    try {
        let result = {
            studentCount: 0,
            followUpCount: 0
        };
        result.studentCount = await getStudentCount();
        result.followUpCount = await getFollowUpCount();
        
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

const getStudentCount = () => {
    return new Promise((resolve, reject) => {
        Student.count({}, (err, countstudent) => {
            resolve(countstudent);
        })
    });
}

const getFollowUpCount = () => {
    return new Promise((resolve, reject) => {
        followUpModel.count({}, (err, countstudent) => {
            resolve(countstudent);
        })
    });
}

module.exports = { getdashboardDetails }