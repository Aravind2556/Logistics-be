const Express = require('express')
const tripModel = require('../models/Trip')
const vehicleModel = require('../models/vehicle')
const employeeModel = require('../models/Employess')
const isAuth = require('../middleware/isAuth')

const tripRouter = Express.Router()

tripRouter.post('/create-trip',async(req, res)=>{
    try{
        const {vehicleNumber, employeeId, startLocation, endLocation, startTime, expenses, endTime, earnedIncome} = req.body

        if(!vehicleNumber || !employeeId || !startLocation || !endLocation || !startTime ){
            return res.send({success: false, message: "Please provide all the required fields!"})
        }

        const isVehicle = await vehicleModel.findOne({vehicleNumber})
        if(!isVehicle){
            return res.send({success: false, message: "Vehicle is not found!"})
        }

        const isEmployee = await employeeModel.findOne({id: employeeId})
        if(!isEmployee){
            return res.send({success: false, message: "Employee is not found!"})
        }

        const Trips = await tripModel.find({})
        let id;
        if(Trips && Trips.length>0){
            const lastTripId = Trips.slice(-1)[0].id
            id = lastTripId+1
        }
        else{
            id = 1
        }

        let tempTrip = {
            id, vehicleNumber, employeeId, startLocation, endLocation,
            startTime: new Date(startTime),
        }

        if(endTime){
            tempTrip.endTime = new Date(endTime)
        }

        if(earnedIncome){
            tempTrip.earnedIncome = earnedIncome
        }

        if(expenses){
            tempTrip.expenses = expenses
        }

        const Trip = new tripModel(tempTrip)

        const saveTrip = await Trip.save()

        if(!saveTrip){
            return res.send({success: false, message: "Failed to create Trip!"})
        }

        return res.send({success: true, message: "Trip created succesfully!"})

    }
    catch(err){
        console.log("Error in creating Trip:",err)
        return res.send({success: false, message: "Trouble in creating Trip! Please contact developer."})
    }
})


tripRouter.get("/fetch-trips", async (req, res)=>{
    try{
        const Trips = await tripModel.find({})
        if(!Trips){
            return res.send({success: false, message: "No Trips data are available!"})
        }

        return res.send({success: true, message: "Trips fetched succesfully!", trips: Trips})
    }
    catch(err){
        console.log("Error in fetching Trips:",err)
        return res.send({success: false, message: "Trouble in fetching Trips! Please contact developer."})
    }
})

tripRouter.get("/fetch-trip/:id", async (req, res)=>{
    try{

        const {id} = req.params

        if(!id){
            return res.send({success: false, message: "Failed to fetch Trip ID!"})
        }

        const Trip = await tripModel.findOne({id: id})
        if(!Trip){
            return res.send({success: false, message: "Trip data not found!"})
        }

        return res.send({success: true, message: "Trip fetched succesfully!", trip: Trip})
    }
    catch(err){
        console.log("Error in fetching Trip:",err)
        return res.send({success: false, message: "Trouble in fetching Trip! Please contact developer."})
    }
})

tripRouter.post("/update-trip/:id", async (req, res)=>{
    try{

        const {id} = req.params

        if(!id){
            return res.send({success: false, message: "Failed to fetch Trip ID!"})
        }

        const Trips = await tripModel.findOne({id: id})
        if(!Trips){
            return res.send({success: false, message: "Trip data not found!"})
        }

        const {vehicleNumber, employeeId, startLocation, endLocation, startTime, endTime, status, expenses, earnedIncome} = req.body

        if(!vehicleNumber || !employeeId || !startLocation || !endLocation || !startTime ){
            return res.send({success: false, message: "Please provide all the required fields!"})
        }

        const isVehicle = await vehicleModel.findOne({vehicleNumber})
        if(!isVehicle){
            return res.send({success: false, message: "Vehicle is not found!"})
        }

        const isEmployee = await employeeModel.findOne({id: employeeId})
        if(!isEmployee){
            return res.send({success: false, message: "Employee is not found!"})
        }

        let tempTrip = {
            id, vehicleNumber, employeeId, startLocation, endLocation,
            startTime: new Date(startTime),
        }

        if(endTime){
            tempTrip.endTime = new Date(endTime)
        }

        if(earnedIncome){
            tempTrip.earnedIncome = earnedIncome
        }

        if(status){
            tempTrip.status = status
        }

        if(!tempTrip){
            return  res.send({success: false, message: "Failed to organise data! Please contact developer!"})
        }

        const updateTrip = await tripModel.updateOne({id}, {$set: tempTrip})

        if(!updateTrip.acknowledged){
            return res.send({success: false, message: "Failed to update Trip!"})
        }

        if(expenses && expenses.length>0){

            const pushExpense = await tripModel.updateOne(
                { id },
                { $push: { expenses: { $each: expenses } } }
            )

            if (!pushExpense.acknowledged) {
                return res.send({
                  success: false,
                  message: "Trip updated, but failed to update Expenses!"
                });
            }

            const updatedTripDoc = await tripModel.findOne({ id });
            if (!updatedTripDoc) {
            return res.send({ success: false, message: "Trip not found after update!" });
            }

            const totalExpenses = updatedTripDoc.expenses.reduce(
                (sum, e) => sum + (e.amount || 0),
                0
            )

            const profit = (updatedTripDoc.earnedIncome || 0) - totalExpenses

            const finalUpdate = await tripModel.updateOne(
                { id },
                { $set: { totalExpenses, profit } }
            );
        
            if (!finalUpdate.acknowledged) {
                return res.send({
                    success: false,
                    message: "Trip updated, but failed to finalize totalExpenses and profit!"
                });
            }

            return res.send({success: true, message: "Trip updated succesfully!"})

        }
        else{
            return res.send({success: true, message: "Trip updated succesfully!"})
        }

    }
    catch(err){
        console.log("Error in updating Trip:",err)
        return res.send({success: false, message: "Trouble in updating Trip! Please contact developer."})
    }
})


tripRouter.get("/delete-trip/:id", async (req, res)=>{
    try{

        const {id} = req.params

        if(!id){
            return res.send({success: false, message: "Failed to fetch Trip ID!"})
        }

        const Trips = await tripModel.deleteOne({id})
        if(!Trips){
            return res.send({success: false, message: "Trip data not found!"})
        }

        return res.send({success: true, message: "Trip deleted succesfully!", trips: Trips})
    }
    catch(err){
        console.log("Error in deleting Trip:",err)
        return res.send({success: false, message: "Trouble in deleting Trip! Please contact developer."})
    }
})


module.exports = tripRouter