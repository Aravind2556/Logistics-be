const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {type: String,required: true,unique: true,trim: true,uppercase: true,match: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/},
    name: {type: String,required: true,trim: true},
    manufacturer: {type: String,required: true,trim: true },
    yearOfManufacture: {type: Number,required: true,min: 1900,max: new Date().getFullYear()},
    type: {type: String,required: true,enum: ['Tipper Truck', 'Container Truck', 'Tanker Truck'], default : "Trucks" },
    lastServiceDate: [{type: Date}],
    nextServiceDate: [{type: Date}],
    desc: { type: String, trim: true },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', VehicleSchema);
module.exports = Vehicle;
