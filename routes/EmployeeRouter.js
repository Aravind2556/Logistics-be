const Express = require('express')
const EmployeeModel = require('../models/Employess')
const isAuth = require('../middleware/isAuth')

const EmployeeRouter = Express.Router()

// API END point is using create employee
EmployeeRouter.post('/create-employee', async(req,res)=>{
    try{
        let employee = await EmployeeModel.find({})
        let id
        if (employee.length !== 0){
            let lastemployee = employee.slice(-1)
            let last = lastemployee[0]
            id = last.id+1
        }else{ 
          id = 1
        }
        const {name,email,phonenumber,joinedDate,salaryPermonth,address,identityType,identityNumber,workingStatus}=req.body

        if (!moment(joinedDate, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({ error: "Invalid date format for JoinedDate" });
        }

        console.log("checking emolyees",name,joinedDate,salaryPermonth,address,identityType,identityNumber,id,workingStatus)
        if(id && email && phonenumber && name && joinedDate && salaryPermonth && address && identityType && identityNumber && workingStatus){
            const isEmployee = await EmployeeModel.findOne({Email : email})
            if(isEmployee){
                return res.json({success : false , message :"This Employee details is already registed please register new Employee"})
            }
            const createEmployee = new EmployeeModel({
                id : id ,
                name : name,
                Email : email,
                phoneNumber : phonenumber,
                joinedDate : joinedDate,
                salaryPerMonth : salaryPermonth,
                address : address,
                identityType :identityType,
                identityNumber:identityNumber,
                workingStatus : workingStatus
            })
            await createEmployee.save()
            if(createEmployee){
                return res.json({success : true , message :"Employee detail register successfully"})
            }
            else{
                return res.send({success : false , message : "Employee details register faild please try again later"})
            }
        }
        else{
            return res.send({success : false , message : "please provide all details is required"})
        }
    }
    catch (err) {
        console.error("A troubling error occurred to create employee", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });

    }
})

// API END point is using Update Salery
EmployeeRouter.put('/Update-employee-salery/:id',isAuth, async (req,res)=>{
    try{
        const {id}=req.params
        const {description,amount}=req.body
        if(id && description && amount){
            const isEmployeeid = await EmployeeModel.findOne({id : id })
            if(isEmployeeid.id){
                let employee = await EmployeeModel.find({})
                let newId
                if (employee.length !== 0){
                    let lastemployee = employee.slice(-1)
                    let last = lastemployee[0]
                    newId = last.id+1
                }else{ 
                    newId = 1
                }
                
                

            }
            else{
                return res.send({success : false , message : "Employee id is required please try agin later"})
            }
        }
        else{
            return res.send({success : false , message : "please provide all details is required"})
        }
        


    }
    catch (err) {
        console.error("A troubling error occurred to Update-employee-salery", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });

    }

})








module.exports = EmployeeRouter