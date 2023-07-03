const asyncHandler = require('express-async-handler')
const StudentModal = require('../models/studentModel')
const Student = StudentModal.StudentModal;
const Status = StudentModal.StautsModal;
const uploadFile = require("../middleware/uploadFileMiddleware");
const { EducationModal, ExpeirenceModal, LanguageModal } = require('../models/studentModel');
const notificationModel = require('../models/notificationModel')
const User = require('../models/userModel')

const addStudent = asyncHandler(async (req, res) => {
    try {
        const imageName = req.file?.filename;
        var existStudent = await Student.findOne({ mobileNumber: req.body.mobileNumber });
        if (existStudent) {
            return res.status(400).json({
                success: false,
                msg: 'Mobile number already exist'
            });
        }
        let education = [];
        let workExperience = [];
        let language = [];

        if (req.body.education) {
            if (Array.isArray(req.body.education)) {
                for (const key in req.body.education) {
                    const element = req.body.education[key];
                    let ejson = JSON.parse(element);
                    let addnew = await EducationModal.create(ejson);
                    education.push(addnew._id)
                }
            } else {
                let ejson = JSON.parse(req.body.education);
                let educationAdd = await EducationModal.create(ejson);
                education.push(educationAdd._id);
            }
        }

        if (req.body.workExperience) {
            if (Array.isArray(req.body.workExperience)) {
                for (const key in req.body.workExperience) {
                    const element = req.body.workExperience[key];
                    let ejson = JSON.parse(element);
                    let addnew = await ExpeirenceModal.create(ejson);
                    workExperience.push(addnew._id)
                }
            } else {
                let ejson = JSON.parse(req.body.workExperience);
                let addnew = await ExpeirenceModal.create(ejson);
                workExperience.push(addnew._id)
            }
        }

        if (req.body.language) {
            if (Array.isArray(req.body.language)) {
                for (const key in req.body.language) {
                    const element = req.body.language[key];
                    let ejson = JSON.parse(element);
                    let addnew = await LanguageModal.create(ejson);
                    language.push(addnew._id)
                }
            } else {
                let ejson = JSON.parse(req.body.language);
                let addnew = await LanguageModal.create(ejson);
                language.push(addnew._id)
            }
        }

        const savedStudent = await Student.create({
            visaType: req.body.visaType,
            name: req.body.studentName,
            address: req.body.address,
            gender: req.body.gender,
            martialStatus: req.body.martialStatus,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            nationality: req.body.nationality,
            citizen: req.body.citizen,
            visaApplyCountry: req.body.visaApplyCountry,
            location: req.body.location,
            photo: imageName,
            spouseName: req.body.spouseName,
            spouseRelation: req.body.spouseRelation,
            spouseCountry: req.body.spouseCountry,
            spouseState: req.body.spouseState,
            spouseCity: req.body.spouseCity,
            spouseCountryStatus: req.body.spouseCountryStatus,
            education: education,
            workExperience: workExperience,
            language: language,
            status: req.body.status,
        });


        if (savedStudent) {
            let resuser = await User.find({ role: 'Receptionist' }).lean();
            let date = new Date();
            let insertdata = resuser.map(f => ({
                description: `New student(${req.body.studentName}) entry has been created`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }
            res.status(201).json({
                success: true,
                message: "Student added successfully."
            }).end()
        }
        else {
            res.status(400)
            throw new Error("Invalid student data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
});

const editStudent = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                saveEditStudent(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})
const saveEditStudent = asyncHandler(async (req, res, imageName) => {
    try {

        if (imageName != "") {
            req.body.imageName = imageName;
        }
        var savedStudent = await Student.findOneAndUpdate(req.body.id, {
            visaType: req.body.visaType,
            name: req.body.studentName,
            address: req.body.address,
            gender: req.body.gender,
            martialStatus: req.body.martialStatus,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            nationality: req.body.nationality,
            citizen: req.body.citizen,
            photo: req.body.imageName.replace(",", ""),
            spouseName: req.body.spouseName,
            spouseRelation: req.body.spouseRelation,
            spouseCountry: req.body.spouseCountry,
            spouseState: req.body.spouseState,
            spouseCity: req.body.spouseCity,
            spouseCountryStatus: req.body.spouseCountryStatus,
            education: req.body.education,
            workExperience: req.body.workExperience,
            language: req.body.language,
            status: req.body.status,
        });
        if (savedStudent) {
            res.status(201).json({
                message: "Student saved successfully."
            }).end()
        }
        else {
            res.status(400)
            throw new Error("Invalid student data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
});

const getStudentById = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("education").populate("workExperience").populate("language").populate("assignedManager").populate("status").lean();

        res.status(200).json(student).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
})

const getStudents = asyncHandler(async (req, res) => {
    try {
        let filter = {};
        if (req.user.role == 'Manager') {
            filter = { assignedManager: req.user._id }
        } else if (req.user.role == 'Receptionist') {
            filter = { assignedManager: { $eq: null }, assignedManagerRequest: { $eq: null } }
        }
        if (req.body.location) {
            filter = {location:req.body.location};
        }
        const student = await Student.find(filter).sort({updatedAt: -1})
            .populate("education")
            .populate("workExperience")
            .populate("language")
            .populate("assignedManager", '_id name email phoneNumber')
            .populate("status");

        res.status(200).json(student).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
})

const getStudentPending = asyncHandler(async (req, res) => {
    // assignedManagerRequest
    try {
        let filter = { assignedManager: { $eq: null }, assignedManagerRequest: { $ne: null } };
        if (req.user.role == 'Manager') {
            filter.assignedManagerRequest = req.user._id;
        }
        const student = await Student.find(filter).populate("education").populate("workExperience").populate("language").populate("assignedManager", '_id name email phoneNumber').populate("status");

        res.status(200).json(student).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting student. " + err.message,
            data: null,
        });

    }
})

const updateStatus = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            status: req.body.statusId,
        });
        res.status(200).json({ message: "Update Status successfully." }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating manager. " + err.message,
            data: null,
        });

    }
})

const assignedManager = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            assignedManagerRequest: req.body.manager,
            assignedManagerRequestBy: req.body.userId,
            updatedBy: req.body.userId
        });

        let date = new Date();
        const savedNotification = await notificationModel.create({
            description: `User ${student.name} request has been send to you.`,
            date: date,
            userId: req.body.manager,
            Isread: false
        });


        res.status(200).json({ message: "Manager assigned successfully." }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating manager. " + err.message,
            data: null,
        });

    }
})

const cancelManagerRequest = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            assignedManagerRequest: null,
            updatedBy: req.user._id
        });

        if (student.assignedManagerRequestBy) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Request cancelled for ${student.name}.`,
                date: date,
                userId: student.assignedManagerRequestBy,
                Isread: false
            });
        }


        res.status(200).json({ message: "Cancel request successfully." }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating manager. " + err.message,
            data: null,
        });

    }
})

const acceptManagerRequest = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.body.studentId, {
            assignedManagerRequest: null,
            assignedManager: req.user._id,
            updatedBy: req.user._id
        });

        if (student.assignedManagerRequestBy) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Request accepted for ${student.name}.`,
                date: date,
                userId: student.assignedManagerRequestBy,
                Isread: false
            });
        }


        res.status(200).json({ message: "Request accepted successfully." }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating manager. " + err.message,
            data: null,
        });

    }
})

const createStatus = asyncHandler(async (req, res) => {
    try {

        let statusName = req.body.name;
        let step = req.body.step;

        if (!statusName || !step) {
            res.status(400)
            throw new Error('Name or step not found');
        }
        //create status
        const status = await Status.create({
            statusName,
            step
        })
        if (status) {
            res.status(201).json({
                name: statusName,
                step: step
            })
        }
        else {
            res.status(400)
            throw new Error("Invalid status data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating status. " + err.message,
            data: null,
        });
    }
})

const editStatus = asyncHandler(async (req, res) => {
    try {
        let statusName = req.body.name;
        let step = req.body.step;

        if (!statusName || !step) {
            res.status(400)
            throw new Error('Name or step not found');
        }

        //create status
        const status = await Status.findOne({ _id: req.body.id });

        if (!status) {
            res.status(400)
            throw new Error("Status not found!")
        }

        let updatecount = await Status.findByIdAndUpdate(req.body.id, {
            statusName: statusName,
            step: step
        });
        res.status(200).json({
            success: true,
            msg: "Status updated successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating status. " + err.message,
            data: null,
        });
    }
})

const getAllStatus = asyncHandler(async (req, res) => {
    try {
        const status = await Status.find().sort('step');

        res.status(200).json(status).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

const getStatusById = asyncHandler(async (req, res) => {
    try {
        const status = await Status.findOne({ _id: req.params.id });

        res.status(200).json(status).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });
    }
})


const deleteStatusById = asyncHandler(async (req, res) => {
    try {
        const status = await Status.findByIdAndDelete(req.params.id);

        res.status(200).json(status).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });
    }
})

const changeStatus = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(req.body.studentId, {
            status: req.body.status
        })
        return res.status(200).json({
            success: true,
            msg: "Status changed successfully. "
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in changing status. " + err.message,
            data: null,
        });
    }
})

const editPirsonalInfo = asyncHandler(async (req, res) => {
    try {
        var savedStudent = await Student.findByIdAndUpdate(req.body.id, {
            visaType: req.body.visaType,
            name: req.body.studentname,
            address: req.body.address,
            gender: req.body.gender,
            martialStatus: req.body.martialStatus,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            nationality: req.body.nationality,
            citizen: req.body.citizen,
            // photo: req.body.imageName.replace(",", ""),
            spouseName: req.body.spouseName,
            spouseRelation: req.body.spouseRelation,
            spouseCountry: req.body.spouseCountry,
            spouseState: req.body.spouseState,
            spouseCity: req.body.spouseCity,
            spouseCountryStatus: req.body.spouseCountryStatus,
            assignedManager: req.body.assignedManager,
            // education: req.body.education,
            // workExperience: req.body.workExperience,
            // language: req.body.language,
            status: req.body.status,
        });
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})

const getStudentEducation = asyncHandler(async (req, res) => {
    try {
        var studentEducation = await Student.findById(req.params.studentid).populate("education").select("education");
        res.status(200).json(studentEducation).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})


const getStudentworkExperience = asyncHandler(async (req, res) => {
    try {
        var studentEducation = await Student.findById(req.params.studentid).populate("workExperience").select("workExperience");
        res.status(200).json(studentEducation).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})


const getStudentlanguages = asyncHandler(async (req, res) => {
    try {
        var studentEducation = await Student.findById(req.params.studentid).populate("language").select("language");
        res.status(200).json(studentEducation).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})


const editEducation = asyncHandler(async (req, res) => {
    try {
        var savedEducationStudent = await EducationModal.findByIdAndUpdate(req.body.id, {
            institue: req.body.institue,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            education: req.body.education,
            marks: req.body.marks,
            educationType: req.body.educationType,
        });
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }
})


const editlanguage = asyncHandler(async (req, res) => {
    try {
        var savedLanguageStudent = await LanguageModal.findByIdAndUpdate(req.body.id, {
            languageName: req.body.languageName,
            speak: req.body.speak,
            write: req.body.write,
            listening: req.body.listening,
            read: req.body.read,
        });
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }

})
const addEducation = asyncHandler(async (req, res) => {
    try {
        const studentId = req.params.id;
        const Educations = await EducationModal.create({
            institue: req.body.institue,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            education: req.body.education,
            marks: req.body.marks,
            educationType: req.body.educationType
        })
        if (Educations) {
            var addEducation = await Student.findByIdAndUpdate(
                studentId, { $push: { education: Educations._id } }
            )
        }
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating status. " + err.message,
            data: null,
        });
    }
})

const addLanguage = asyncHandler(async (req, res) => {
    try {
        const studentId = req.params.id;
        var existLanguage = await LanguageModal.findOne({ languageName: req.body.languageName });
        // var existstdLanguage = await Student.findOne({ languageName: req.body.languageName });
        if (existLanguage) {
            return res.status(400).json({
                success: false,
                msg: 'Language already exist'
            });
        }
        const language = await LanguageModal.create({
            languageName: req.body.languageName,
            speak: req.body.speak,
            write: req.body.write,
            listening: req.body.listening,
            read: req.body.read
        })
        if (language) {
            var addEducation = await Student.findByIdAndUpdate(
                studentId, { $push: { language: language._id } }
            )
        }
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating status. " + err.message,
            data: null,
        });
    }
})

const addWorkExperiance = asyncHandler(async (req, res) => {
    try {
        const studentId = req.params.id;
        const workExperience = await ExpeirenceModal.create({
            company: req.body.company,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            designation: req.body.designation,
            workType: req.body.workType,

        })
        if (workExperience) {
            var addEducation = await Student.findByIdAndUpdate(
                studentId, { $push: { workExperience: workExperience._id } }
            )
        }
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating status. " + err.message,
            data: null,
        });
    }
})

const editWorkExperiance = asyncHandler(async (req, res) => {
    try {
        var savedWorkExperianceStudent = await ExpeirenceModal.findByIdAndUpdate(req.body.id, {
            company: req.body.company,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            designation: req.body.designation,
            workType: req.body.workType,
        });
        res.status(201).json({
            message: "saved successfully."
        }).end()

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in saving student. " + err.message,
            data: null,
        });

    }

})

const deleteWorkExperiance = asyncHandler(async (req, res) => {
    try {
        const studentId = req.body.studentId;
        var deleteExpstud = await Student.findByIdAndUpdate(
            studentId, { $pull: { workExperience: req.body.workExperianceId } }
        )

        var deleteexp = await ExpeirenceModal.findByIdAndDelete(req.body.workExperianceId)
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

const deleteLanguage = asyncHandler(async (req, res) => {
    try {
        const studentId = req.body.studentId;
        var deletestulang = await Student.findByIdAndUpdate(
            studentId, { $pull: { language: req.body.languageId } }
        )

        var deletelang = await LanguageModal.findByIdAndDelete(req.body.languageId)
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

const deleteEducation = asyncHandler(async (req, res) => {
    try {
        const studentId = req.body.studentId;
        var deleteeducationstd = await Student.findByIdAndUpdate(
            studentId, { $pull: { education: req.body.educationId } }
        )

        var deleteeducation = await EducationModal.findByIdAndDelete(req.body.educationId)
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

const getallEducation = asyncHandler(async (req, res) => {
    // try {

    //     const Eductionlist = await Student.findById(req.params.id)
    //     if (req.body.education) {
    //         if (Array.isArray(req.body.education)) {
    //             for (const key in req.body.education) {
    //                 const element = req.body.education[key];
    //                 let ejson = JSON.parse(element);
    //                 let addnew = await EducationModal.create(ejson);
    //                 education.push(addnew._id)
    //             }
    //         } else {
    //             let ejson = JSON.parse(req.body.education);
    //             let educationAdd = await EducationModal.create(ejson);
    //             education.push(educationAdd._id);
    //         }
    //     }
    //     res.status(200).json({Eductionlist})
    // } catch (err) {
    //     return res.status(400).json({
    //         success: false,
    //         msg: "Error in saving student. " + err.message,
    //         data: null,
    //     });

})
const MobileVerify = asyncHandler(async (req, res) => {
    try {
        var existNumber = await Student.findOne({ mobileNumber: req.body.mobileNumber });
        if (existNumber) {
            return res.status(400).json({
                success: false,
                msg: 'Mobile number already exist'
            });
        }
        else {
            return res.status(400).json({
                success: true,

            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting . " + err.message,
            data: null,
        });

    }
})

const EmailVerify = asyncHandler(async (req, res) => {
    try {
        var existEmail = await Student.findOne({ email: req.body.email });
        if (existEmail) {
            return res.status(400).json({
                success: false,
                msg: 'Email already exist'
            });
        }
        else {
            return res.status(400).json({
                success: true,

            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting . " + err.message,
            data: null,
        });

    }
})
module.exports = {
    addStudent, getStudentById, getStudents, assignedManager, createStatus, editStatus, getAllStatus, getStatusById, changeStatus, editStudent, updateStatus, editPirsonalInfo, editEducation, addEducation, addLanguage, editlanguage, addWorkExperiance, editWorkExperiance, deleteWorkExperiance, deleteLanguage, deleteEducation,
    getallEducation, getStudentEducation, getStudentworkExperience,
    getStudentlanguages, MobileVerify, EmailVerify,
    deleteStatusById,
    getStudentPending,
    cancelManagerRequest,
    acceptManagerRequest
}
