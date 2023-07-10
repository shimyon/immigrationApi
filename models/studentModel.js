const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const studentSchema = mongoose.Schema(
    {
        visaType: {
            type: String,
            required: [true, 'Visa Type not found'],
        },
        name: {
            type: String,
            required: [true, 'Please add name'],
           
        },
        address: {
            type: String,
            required: [true, 'Please add address'],
        },
        gender: {
            type: String,
            required: [true, 'Please add gender'],
        },
        martialStatus: {
            type: String
        },
        mobileNumber: {
            type: Number,
            required: [true, 'Please add mobile number'],

        },
        email: {
            type: String,
            required: [true, 'Please add email'],

        },
        visaApplyCountry: {
            type: String,
            required: [true, 'Please visa apply country'],
        },
        nationality: {
            type: String
        },
        photo: {
            type: String
        },
        spouseName: {
            type: String
        },
        spouseRelation: {
            type: String
        },
        spouseCountry: {
            type: String
        },
        spouseState: {
            type: String
        },
        spouseCity: {
            type: String
        },
        spouseCountryStatus: {
            type: String
        },
        education: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Educations'
        }],
        workExperience: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Experience'
        }],
        language: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Languages'
        }],
        assignedManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        assignedManagerRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        assignedManagerRequestBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'location'
        },
        TenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant'
          },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }

    },
    {
        timestamps: true,
    }
)

const educationsSchema = mongoose.Schema(
    {
        institue: {
            type: String
        },
        fromDate: {
            type: Number
        },
        toDate: {
            type: Number
        },
        education: {
            type: String
        },
        marks: {
            type: String
        },
        educationType: {
            type: String
        }
    })

const experienceSchema = mongoose.Schema(
    {
        company: {
            type: String
        },
        fromDate: {
            type: Date
        },
        toDate: {
            type: Date
        },
        designation: {
            type: String
        },
        workType: {
            type: String
        }
    })

const languageSchema = mongoose.Schema(
    {
        languageName: {
            type: String
        },
        speak: {
            type: Number
        },
        read: {
            type: Number
        },
        write: {
            type: Number
        },
        listening: {
            type: Number
        }
    })

const statusSchema = mongoose.Schema(
    {
        statusName: {
            type: String
        },
        step: {
            type: Number
        }
    })

const StudentModal = mongoose.model('Students', studentSchema)
const EducationModal = mongoose.model('Educations', educationsSchema)
const ExpeirenceModal = mongoose.model('Experience', experienceSchema)
const LanguageModal = mongoose.model('Languages', languageSchema)
const StautsModal = mongoose.model('Status', statusSchema)

const syncIndex = async () => {
    await StudentModal.syncIndexes();
    await EducationModal.syncIndexes();
    await ExpeirenceModal.syncIndexes();
    await LanguageModal.syncIndexes();
    await StautsModal.syncIndexes();
};

syncIndex();

module.exports = { StudentModal, EducationModal, ExpeirenceModal, LanguageModal, StautsModal };