const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const locationSchema = mongoose.Schema(
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

locationSchema.index({ TenantId: 1, name: 1 }, { unique: true });


module.exports = mongoose.model('location', locationSchema)