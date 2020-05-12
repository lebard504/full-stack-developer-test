/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
var moment = require('moment');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { validationResult } = require('express-validator');
const vehicleService = require('../services/vehicleService');
const recordService = require('../services/recordService');
const categoryService = require('../services/categoryService');

var dummyCategories = {
  0: 'No Residente',
  1: 'Residente',
  2: 'Oficial'
};

function parkingStayController() {
  async function setArrival(req, res) {
    var responseBody = { message: null, payload: {} };
    var { carplate } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseBody.message = { errors: errors.array() };
      return res.status(400).send(responseBody);
    }

    try {
      // Get or create resource vehicle
      const currentVehicle = await vehicleService.getByPlate(carplate);
      // Related record with arrive time
      const record = {
        arrivaltime: moment(req.body.arrivaltime).utc().toDate()
      };

      // If resource exists
      if (currentVehicle) {
        const lasRecord = currentVehicle.records.pop();

        if (lasRecord && !lasRecord.departuretime) {
          throw new Error('The current vehicle still has an arrival without closure.');
        }

        const payloadData = await vehicleService
          .addRecord(currentVehicle._id, record);
        responseBody.message = 'Arrive was created successfully';
        responseBody.payload = payloadData;
        return res.send(responseBody);
      }
      // Create resource if does not exist and set initial record
      const payloadData = await vehicleService.createOne({
        carplate,
        record
      });

      responseBody.message = 'Arrive was created successfully';
      responseBody.payload = payloadData;
      return res.send(responseBody);
    }
    catch (error) {
      responseBody.message = error.message;
      return res.status(500).send(responseBody);
    }
  }

  async function setDeparture(req, res) {
    var responseBody = { message: null, payload: {} };
    var { carplate } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseBody.message = { errors: errors.array() };
      return res.status(400).send(responseBody);
    }

    try {
      const currentVehicle = await vehicleService
        .getByPlate(carplate);
      const relatedUserCategory = await categoryService
        .getById(currentVehicle.category._id);

      if (!currentVehicle) {
        throw new Error('The vehicle you want to process does not exist. You must register an arrive.');
      }
      // If resource exists
      const lasRecord = currentVehicle.records.pop();

      if (lasRecord.departuretime) {
        throw new Error('The vehicle you want to process does not have the last arrive record.');
      }

      const response = await recordService.updateDepartureTime(lasRecord._id,
        moment(req.body.departuretime).utc().toDate());

      let payment = {};

      // I current user is No Residente, make payment
      if (relatedUserCategory.name === dummyCategories[0]) {
        const authHeader = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${req.token}`
          }
        };

        const paymentResponse = await axios
          .get(`${process.env.PAYMENT_API_URI}/departurepayment/${currentVehicle._id}`, {}, authHeader);

        if (paymentResponse.status !== 200) {
          throw new Error('Something is wrong with Payment API');
        }

        payment = paymentResponse.data;
      }

      responseBody.message = 'Departure was created successfully';
      responseBody.payload = {
        record: response,
        payment
      };

      return res.send(responseBody);
    }
    catch (error) {
      responseBody.message = error.message;
      return res.status(500).send(responseBody);
    }
  }

  async function findVehicle(req, res) {
    var responseBody = { message: null, payload: {} };
    var { id } = req.params;

    vehicleService.getById(id)
      .then((result) => {
        responseBody.payload = result;
        res.json(responseBody);
      }).catch((error) => {
        responseBody.message = error.message;
        res.status(500).send(responseBody);
      });
  }

  // Categories dummies
  function getCategoryDummy(category) {
    const dummies = [
      {
        key: dummyCategories[1],
        value: {
          name: dummyCategories[1],
          description: 'Sed ut perspiciatis unde omnis iste natus sit.',
          byMonth: true,
          percent: 0.05
        }
      },
      {
        key: dummyCategories[2],
        value: {
          name: dummyCategories[2],
          description: 'Sed ut perspiciatis unde omnis iste natus sit.',
          byMonth: false,
          percent: 0
        }
      }
    ];

    return dummies.find((x) => x.key === category).value;
  }

  async function setVehicleToOfficial(req, res) {
    var responseBody = { message: null, payload: {} };
    var { carplate } = req.params;

    try {
      // Get or create Official category
      const category = await categoryService
        .getLastByName(dummyCategories[2], getCategoryDummy(dummyCategories[2]));

      const response = await vehicleService
        .changeVehicleCategory(carplate, category);

      responseBody.message = response;
      return res.send(responseBody);
    }
    catch (error) {
      responseBody.message = error.message;
      return res.status(500).send(responseBody);
    }
  }

  async function setVehicleToResident(req, res) {
    var responseBody = { message: null, payload: {} };
    var { carplate } = req.params;

    try {
      // Get or create Official category
      const category = await categoryService
        .getLastByName(dummyCategories[1], getCategoryDummy(dummyCategories[1]));

      const response = await vehicleService
        .changeVehicleCategory(carplate, category);

      responseBody.message = response;
      return res.send(responseBody);
    }
    catch (error) {
      responseBody.message = error.message;
      return res.status(500).send(responseBody);
    }
  }

  async function startMonth(req, res) {
    var responseBody = { message: null, payload: {} };
    try {
      // Get or create Official category
      const officialCategory = await categoryService
        .getLastByName(dummyCategories[2], getCategoryDummy(dummyCategories[2]));

      // Get or create residente category
      const residentCategory = await categoryService
        .getLastByName(dummyCategories[1], getCategoryDummy(dummyCategories[1]));
      // The application eliminates stays registered in official cars.
      await vehicleService
        .deleteRecordsByVehicleCategory(officialCategory);
      // Set the parked time for resident vehicles to zero.
      await vehicleService
        .resetRecordTimeByVehicleCategory(residentCategory);

      responseBody.message = 'The restarting month process was successful';
      return res.send(responseBody);
    }
    catch (error) {
      responseBody.message = error.message;
      return res.status(500).send(responseBody);
    }
  }

  async function getResidentPayments(req, res) {
    var responseBody = { message: null, payload: {} };
    var { filename } = req.params;
    try {
      // CSV file writer
      const csvFileName = `${filename}.csv`;
      const csvWriter = createCsvWriter({
        path: csvFileName,
        header: [
          { id: 'carplate', title: '# placa' },
          { id: 'total_time', title: 'Tiempo estacionamiento (min)' },
          { id: 'value', title: 'Cantidad a pagar' }
        ]
      });

      // Get or create residente category
      const residentCategory = await categoryService
        .getLastByName(dummyCategories[1], getCategoryDummy(dummyCategories[1]));

      const authHeader = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${req.token}`
        }
      };

      const paymentResponse = await axios
        .get(`${process.env.PAYMENT_API_URI}/paymentsbycategory/${residentCategory._id}`, {}, authHeader);

      if (paymentResponse.status !== 200) {
        throw new Error('Something is wrong with Payment API');
      }

      await csvWriter.writeRecords(paymentResponse.data);
      // Get or create Official category
      return res.download(`./${csvFileName}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    catch (error) {
      responseBody.message = error.message;
      return res.status(500).send(responseBody);
    }
  }

  return {
    setArrival, getResidentPayments, setDeparture, findVehicle, setVehicleToOfficial, setVehicleToResident, startMonth
  };
}

module.exports = parkingStayController;
