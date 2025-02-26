const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    id: {type : Number , required : true , unique : true},
    name:{type : String , required : true },
    Email : {type : String ,required : true , unique : true },
    joinedDate: {type: Date},
    salaryPerMonth: {type : Number},
    phoneNumber : {type : String},
    sendTotalSalary: {type : Number},
    remainingSalary: {type : Number},
    salaryTransactions: [
        {
            id: {type : Number},
            description:{type : String},
            amount:{type : Number}
        }
    ],
    workingStatus: {type : String},
    releavedOn: {type: Date},
    address: {type : String , required : true },
    identityType: {type : String , required : true },
    identityNumber: {type : String , required : true },
    drivenTrips:{type : Number},
}, { timestamps: true });

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
