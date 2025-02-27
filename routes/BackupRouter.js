const express = require('express');
// const { parse } = require('json2csv');
const excelJS = require('exceljs');
const EmployeeModel = require('../models/Employess');
const TripModel = require('../models/Trip');
const VehicleModel = require('../models/vehicle');
const UserModel = require('../models/User');

const BackupRouter = express.Router();

BackupRouter.get('/backup', async (req, res) => {
    try {

        const workbook = new excelJS.Workbook();

        const Employees = await EmployeeModel.find({});
        const Vehicles = await VehicleModel.find({});
        const Users = await UserModel.find({});
        const Trips = await TripModel.find({});

        // Create individual sheets for each collection (excluding hospitals)
        addSheet(workbook, 'Trips', Trips);
        addSheet(workbook, 'Employees', Employees);
        addSheet(workbook, 'Vehicles', Vehicles);
        addSheet(workbook, 'Users', Users);
        

        // Set up Excel file response
        const fileName = `backup_${Date.now()}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        // Write workbook to response
        await workbook.xlsx.write(res).then(() => res.end());
    } catch (error) {
        console.error('Error in backup generation:', error);
        res.send({ success: false, message: 'Failed to generate backup. Please try again.' });
    }
});

// Helper function to add a sheet to the workbook
function addSheet(workbook, sheetName, data) {
    const sheet = workbook.addWorksheet(sheetName);
    if (data.length > 0) {
        const headers = Object.keys(data[0].toJSON());
        sheet.columns = headers.map((header) => ({ header, key: header }));
        sheet.addRows(data.map((item) => item.toJSON()));
    } else {
        sheet.addRow(['No Data Available']);
    }
}

module.exports = BackupRouter