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
        console.log("checking emolyees",name,joinedDate,salaryPermonth,address,identityType,identityNumber,id,workingStatus)
        if(id && email && phonenumber && name && joinedDate && salaryPermonth && address && identityType && identityNumber && (workingStatus===false || workingStatus===true)){
            const isEmployee = await EmployeeModel.findOne({Email : email})
            if(isEmployee){
                return res.send({success : false , message :"This Employee details is already registed please register new Employee"})
            }
            const createEmployee = new EmployeeModel({
                id : id ,
                name : name,
                Email : email,
                phoneNumber : phonenumber,
                joinedDate : new Date(joinedDate),
                salaryPerMonth : salaryPermonth,
                address : address,
                identityType :identityType,
                identityNumber:identityNumber,
                workingStatus : workingStatus
            })
            const isEmployeeCreated = await createEmployee.save()
            if(isEmployeeCreated){
                return res.send({success : true , message :"Employee detail registered successfully!"})
            }
            else{
                return res.send({success : false , message : "Employee details registration failed! please try again later"})
            }
        }
        else{
            return res.send({success : false , message : "please provide all details"})
        }
    }
    catch (err) {
        console.error("A troubling error occurred to create employee", err);
        return res.send({ success: false, message: "A troubling error occurred. Please contact the developer." });

    }
})

// API END point is using Update Salery
EmployeeRouter.put('/Update-employee-salery/:id',  async (req, res) => {
    try {
      const { id } = req.params;
      const { description, amount} = req.body;
      
      if (!id || !description || !amount) {
        return res.status(400).send({
          success: false,
          message: "Please provide all required details: id, description, and amount"
        });
      }
       const employee = await EmployeeModel.findOne({ id: id });
      if (!employee) {
        return res.send({success: false,message: "Employee not found. Please check the id."});
      }


      const monthlySalary = employee.salaryPerMonth
      const JoinedDate = employee.joinedDate
      const currentDate = new Date()
      const diffInMilli = new Date(currentDate).getTime() - new Date(JoinedDate).getTime()
      const daysDifference = diffInMilli / (1000 * 60 * 60 * 24);   
      const salaryPerDay = monthlySalary/30
      const TotalAmount = salaryPerDay*daysDifference

console.log("SalaryPer Day:",salaryPerDay)
console.log("Total amount to be send:",salaryPerDay*daysDifference)
  
      // Generate new salary transaction id based on the existing transactions
      let newSalaryTransactionId = 1;
      if (employee.salaryTransactions && employee.salaryTransactions.length > 0) {
        const lastTransaction = employee.salaryTransactions[employee.salaryTransactions.length - 1];
        newSalaryTransactionId = lastTransaction.id + 1;
      }
  
      // Create a new salary transaction object
      const newTransaction = {
        id: newSalaryTransactionId,
        description: description,
        amount: amount,
        paymentOn: new Date() 
      };
  
      // Append the new transaction to the salaryTransactions array
      employee.salaryTransactions.push(newTransaction);
  
      // Map through salaryTransactions and add up the amounts for total sent this month
      const totalSent = employee.salaryTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  
      // Update the employee's total sent salary with the calculated total
      employee.sendTotalSalary = totalSent;
  
      // Calculate remaining salary for the month using salaryPerMonth minus the total sent
      employee.remainingSalary = TotalAmount - totalSent;
  
      // Save the updated employee record
      await employee.save();
  
      return res.status(200).send({success: true,message: "Salary transaction updated successfully",
        data: newTransaction,
        totalSent: totalSent,
        remainingSalary: employee.remainingSalary
      });
    } catch (err) {
      console.error("A troubling error occurred in Update-employee-salery", err);
      return res.send({success: false,message: "A troubling error occurred. Please contact the developer."});
    }
  });

  // API END point is using Update Salery
  EmployeeRouter.put('/Update-employee/:id',async(req,res)=>{
    try{
      const {id}=req.params
      const {name,phonenumber,joinedDate,address,identityType,identityNumber,workingStatus,releavedOn}=req.body
      console.log("update employee",id,name,phonenumber,joinedDate,address,identityType,identityNumber,workingStatus,releavedOn)
      if(id && name && phonenumber && joinedDate &&  address && identityType && identityNumber && releavedOn && (workingStatus===false || workingStatus===true) ){
        const isEmployee = await EmployeeModel.findOne({id : id})
        if(isEmployee){
          const upadateEmployee = await EmployeeModel.updateOne(
            {id},
            {$set: {

              name : name , 
              phoneNumber : phonenumber ,
              joinedDate : new Date(joinedDate) ,
              address : address ,
              identityType : identityType ,
              releavedOn : new Date(releavedOn),
              identityNumber : identityNumber , 
              workingStatus : workingStatus
            }}
          )

          if(upadateEmployee){
            return res.send({success : true , message : "Employee status updation succssfully"})
          }
          else{
            return res.send({success : false , message : "Failed to update employee details please try again later"})
          }
        }
        else{

          return res.send({success : false , message : "This Employee id is not required please try again later"})

        }
      

      }
      else{
        return res.send({success : false , message : "All field are required please try again later"})
      }
      

    }
    catch (err) {
      console.error("A troubling error occurred in Update-employee", err);
      return res.send({success: false,message: "A troubling error occurred. Please contact the developer."});
    }
    
  })

// API end point is using Employee delete 
  EmployeeRouter.delete('/delete-Employee/:id',async (req,res)=>{
    try{
      const {id}=req.params
      if(id){
        const isEmployee = await EmployeeModel.findOne({id : id})
        if(isEmployee){
          const deleteEmployee = await EmployeeModel.deleteOne({id : isEmployee.id})
          if(deleteEmployee){
            return res.send({success : true , message : "Employee detail delete successfull"})
          }
          else{
            return res.send({success : false , message : "Failed to delete please try again later"})
          }

        }
        else{
          return res.send({success : false , message : "Employee id is not found please try again later"})
        }
      }
      else{
        return res.send({success : false , message : "Invalid request.Employee id is required."})

      }
    }
    catch (err) {
      console.error("A troubling error occurred in Delete employee", err);
      return res.send({success: false,message: "A troubling error occurred. Please contact the developer."});
    }
  })


  EmployeeRouter.get("/fetch-employee", async (req, res)=>{
    try{
      const employee = await EmployeeModel.find({})
        if(!employee){
            return res.send({success: false, message: "Employee data not found!"})
        }

        return res.send({success: true, message: "Employee fetched succesfully!", EmployeeData : employee})
    }
    catch(err){
        console.log("Error in fetching Trip:",err)
        return res.send({success: false, message: "Trouble in fetching Trip! Please contact developer."})
    }
})



EmployeeRouter.get("/fetch-employee/:id", async (req, res)=>{
  try{
    const {id}=req.params
    if(!id){
      return res.send({success: false, message: "Employee id not found!"})
    }
    const employee = await EmployeeModel.findOne({id : id})
      if(!employee){
          return res.send({success: false, message: "Employee data not found!"})
      }

      return res.send({success: true, message: "Employee fetched succesfully!", EmployeeData : employee})
  }
  catch(err){
      console.log("Error in fetching Trip:",err)
      return res.send({success: false, message: "Trouble in fetching Trip! Please contact developer."})
  }
})
  


module.exports = EmployeeRouter