const mongoose = require('mongoose')

const tripSchema = mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    vehicleNumber: {type: String, required: true, lowercase: true, trim: true},
    employeeId: {type: Number, required: true},
    startLocation: {type: String, required: true},
    endLocation: {type: String, required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date},
    status: {type: String, required: true, lowercase: true, trim: true, enum: ["created", "in-transit", "delivered", "cancelled"], default: "created"},
    expenses: [{
        expenseID: {type: String, lowercase: true, trim: true},
        type: {type: String, enum: ["vehicle", "toll", "other"]},
        amount: {type: Number},
        description: {type: String, trim: true}
    }],
    earnedIncome: {type: Number},
    totalExpenses: {type: Number},
    profit: {type: Number}
},
{
    timestamps: {createdAt: true, updatedAt: true}
})

const tripModel = mongoose.model("Logistics_Trips", tripSchema)

module.exports = tripModel