const asyncHandler = require('express-async-handler')
const followUpModel = require('../models/followUpModel')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;
const StatusModal = StudentModal.StautsModal;
const moment = require('moment');
const userModel = require('../models/userModel');


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


const admindashboard = asyncHandler(async (req, res) => {
    try {
        let result = {
            studentCount: 0,
            followUpCount: 0,
            status: {},
            studentOverMonth: {},
            manageOverMonth: {},
        };
        result.studentCount = await getStudentCount(req);
        result.followUpCount = await getFollowUpCount(req);
        result.status = await getStatusAllCount(req);
        result.studentOverMonth = await getStudentOverMonth(req);
        result.manageOverMonth = await getManagerOverMonth(req);

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

const getStudentOverMonth = async (req) => {
    let studentmonths = [];
    let status = await StatusModal.find({}).lean();
    let labels = [];
    for (let i = 7; i >= 0; i--) {
        const startOfMonth = moment().subtract(i, 'months').startOf('month').startOf('day');
        const endOfMonth = moment().subtract(i, 'months').endOf('month').endOf('day');
        const labelName = startOfMonth.format('MMMM-YYYY');
        labels.push({
            startOfMonth,
            endOfMonth,
            labelName
        })
    }

    for (let skey = 0; skey < status.length; skey++) {
        let StatusName = status[skey].statusName;
        let StatuId = status[skey]._id;
        const monthsStatusData = [];
        for (let i = 0; i < labels.length; i++) {
            let lebel = labels[i];
            let filter = {
                createdAt: {
                    $gte: lebel.startOfMonth.toDate(),
                    $lte: lebel.endOfMonth.toDate()
                },
                status: StatuId
            };
            let count = 0;
            await (new Promise((resolve, reject) => {
                Student.countDocuments(filter, (err, countstudent) => {
                    resolve(countstudent);
                })
            })).then((returncount) => { count = returncount })
            monthsStatusData.push(count);
        }
        // studentmonths[StatusName] = monthsStatusData;
        let color = '#000428';
        if (StatusName.toLowerCase() == 'hot') {
            color = '#000428';
        } else if (StatusName.toLowerCase() == 'warm') {
            color = '#f7ff00';
        } else if (StatusName.toLowerCase() == 'cold') {
            color = '#2af598';
        }
        studentmonths.push({
            label: StatusName,
            data: monthsStatusData,
            borderColor: color,
            backgroundColor: 'white',
            yAxisID: 'y1',
        });
    }
    return {
        labels: labels.map(m => m.labelName),
        datasets: studentmonths
    };
}

const getManagerOverMonth = async (req) => {
    let studentmonths = [];
    let managers = await userModel.find({
        $or: [{ role: 'Admin' }, { role: 'Manager' }],
        is_active: true
    }).lean();
    let labels = [];
    for (let i = 7; i >= 0; i--) {
        const startOfMonth = moment().subtract(i, 'months').startOf('month').startOf('day');
        const endOfMonth = moment().subtract(i, 'months').endOf('month').endOf('day');
        const labelName = startOfMonth.format('MMMM-YYYY');
        labels.push({
            startOfMonth,
            endOfMonth,
            labelName
        })
    }

    for (let skey = 0; skey < managers.length; skey++) {
        let StatusName = managers[skey].name;
        let ManagerId = managers[skey]._id;
        const monthsStatusData = [];
        for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            let filter = {
                createdAt: {
                    $gte: label.startOfMonth.toDate(),
                    $lte: label.endOfMonth.toDate()
                },
                assignedManager: ManagerId
            };
            let count = 0;
            await (new Promise((resolve, reject) => {
                Student.countDocuments(filter, (err, countstudent) => {
                    resolve(countstudent);
                })
            })).then((returncount) => { count = returncount })
            monthsStatusData.push(count);
        }
        
        studentmonths.push({
            label: StatusName,
            data: monthsStatusData,
            borderColor: getRandomColor(),
            backgroundColor: 'white',
            yAxisID: 'y1',
        });
    }
    return {
        labels: labels.map(m => m.labelName),
        datasets: studentmonths
    };
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

module.exports = { getdashboardDetails, admindashboard }