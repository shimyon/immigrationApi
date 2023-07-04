const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const tenantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true
    },
    is_active:{
      type:Boolean,
      default:true
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Tenant', tenantSchema)