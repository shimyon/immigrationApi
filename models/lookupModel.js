const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const lookupSchema = mongoose.Schema(
    {
        lookupGroupName: {
            type: String,
            required: [true, 'Please add an lookup group name'],
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Lookup', lookupSchema)