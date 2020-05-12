/* eslint-disable default-case */

var express = require('express');

const { check } = require('express-validator');
const parkingStayController = require('../controllers/parkingStayController');

const { jwtObject } = require('../middleware/middlewareRules');

const {
  setArrival,
  setDeparture,
  findVehicle,
  setVehicleToOfficial,
  setVehicleToResident,
  startMonth,
  getResidentPayments
} = parkingStayController();

var router = express.Router();

router.put('/:carplate/setarrival', [
  check('arrivaltime', 'arrivaltime does not exist.').exists()
], jwtObject, setArrival);

router.put('/:carplate/setdeparture', [
  check('departuretime', 'departuretime does not exist.').exists()
], jwtObject, setDeparture);

router.patch('/:carplate/toofficial', jwtObject, setVehicleToOfficial);
router.patch('/:carplate/toresident', jwtObject, setVehicleToResident);
router.get('/:id', jwtObject, findVehicle);
router.patch('/startmonth', jwtObject, startMonth);
router.get('/getpayments/:filename', getResidentPayments);

module.exports = router;
