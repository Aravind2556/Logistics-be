const Express = require('express')
const isAuth = require('../middleware/isAuth')
const vehicleModel = require('../models/vehicle')
const moment = require('moment'); // Import moment.js for date conversion

const vehicleRouter = Express.Router()

// API end point is using create vechile details
vehicleRouter.post('/create-vehicle',  async (req, res) => {
    try {
        const { vehicleNumber, name, manufacturer, yearofmanufacture, type, desc , nextServiceDate } = req.body

        if (!moment(nextServiceDate, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({ error: "Invalid date format for nextServiceDate" });
        }

        console.log("create vechile", vehicleNumber, name, manufacturer, yearofmanufacture, type, desc , nextServiceDate)
        if (vehicleNumber && name && manufacturer && yearofmanufacture && type && desc && nextServiceDate) {
            const isvehicleNumber = await vehicleModel.findOne({ vehicleNumber: vehicleNumber })
            if (isvehicleNumber) {
                return res.send({ success: false, message: "This vechicle is already registed please register new vechile number" })
            }

            const createVehicle = new vehicleModel({
                vehicleNumber: vehicleNumber,
                name: name,
                manufacturer: manufacturer,
                yearOfManufacture: yearofmanufacture,
                type: type,
                desc: desc,
                nextServiceDate : nextServiceDate
            })
            await createVehicle.save()

            if (createVehicle) {
                return res.send({ success: true, message: "vechicle detail register successfully" })
            }
            else {
                return res.send({ success: false, message: "vechicle details register faild please try again!" })
            }

        }
        else {
            return res.send({ success: false, message: "please provide all details is required" })
        }

    }
    catch (err) {
        console.error("A troubling error occurred to create vehicle", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });

    }
})

//API end points is using vechile maintance details
vehicleRouter.put('/vehicle-maintance/:vehicleNumber',isAuth,async (req,res)=>{
    try{
        const {vehicleNumber}=req.params
        const {lastServiceDate,nextServiceDate}=req.body

        if (!moment(lastServiceDate, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({ error: "Invalid date format for lastServiceDate" });
        }

        if (!moment(nextServiceDate, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({ error: "Invalid date format for nextServiceDate" });
        }
        
        if(vehicleNumber && lastServiceDate && nextServiceDate ){
            const isvehicleNumber = await vehicleModel.findOne({vehicleNumber : vehicleNumber}) 
            if(isvehicleNumber){
                const updateVehicleMaintenance = await vehicleModel.updateOne(
                    { vehicleNumber },
                    { $set: {lastServiceDate : lastServiceDate,nextServiceDate : nextServiceDate, updatedAt: new Date() } }
                );
                if(updateVehicleMaintenance){
                    return res.send({success : true , message : "This vehicle service maintance update successfully"})
                }
                else{
                    return res.send({success : false , message : "This vehicle maintance update faild please try again"})
                }
            }
            else{
                return res.send({success : false , message : "This vechile number is not required please try again"})
            }

        }
        else{
            return res.send({ success: false, message: "please provide all details is required" })
        }

    }
    catch(err){
        console.error("A troubling error occurred to vehicle maintance", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });
    }

})

// API END points is using Fetch vehicle
vehicleRouter.get('/fetch-vehicle', async (req,res)=>{
    try{
        const fetchVehicle = await vehicleModel.find({})
        if(fetchVehicle.length > 0){
            return res.send({success : true , vehicleInfo : fetchVehicle})
        }
        else{
            return res.send({success : false , message : "No vehicle found"})
        }
    }
    catch(err){
        console.error("A troubling error occurred to fetch vehicle", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });
    }
})

// API END points is using fetch individual vehicle
vehicleRouter.get('/fetch-vehicle/:vehicleNumber', async (req,res)=>{
    try{
        const {vehicleNumber}=req.params
        if(vehicleNumber){
            const isvehicleNumber = await vehicleModel.findOne({vehicleNumber : vehicleNumber})
            if(isvehicleNumber){
                return res.send({success : true , vehicleInfo : isvehicleNumber })
            }
            else{
                return res.send({success : false , message : "Vehicle not found. Please check the vehicle number and try again."})
            }
        }
        else{
            return res.send({success : false , message : "Invalid request. Vehicle number is required."})
        }

    }
    catch(err){
        console.error("A troubling error occurred to fetch individual vehicle ", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });
    }
})

// API END points is using delete individual vehicle
vehicleRouter.delete('/fetch-vehicle/:vehicleNumber',async(req,res)=>{
    try{
        const {vehicleNumber}=req.params
        if(vehicleNumber){
            const isvehicleNumber = await vehicleModel.findOne({vehicleNumber : vehicleNumber})
            if(isvehicleNumber){
                const vehicleNumber = await vehicleModel.deleteOne({vehicleNumber : isvehicleNumber.vehicleNumber })
                if(vehicleNumber){
                    return res.send({success : true , message : "This vehicle detail delete successfully"})
                }
                else{
                     return res.send({message : false , message : "Failed to delete the vehicle. Please try again."})
                }
            }
            else{
                return res.send({message : false , message : "Vehicle not found. Please check the vehicle number and try again."})
            }
        }
        else{
            return res.send({success : false , message : "Invalid request. Vehicle number is required."})
        }
    }
    catch(err){
        console.error("A troubling error occurred to delete individual vehicle ", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });
    }
})






module.exports = vehicleRouter