const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const VisaApplyCountrySchema = mongoose.Schema(
  {
    TenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant'
    },
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('VisaApplyCountry', VisaApplyCountrySchema)