/* eslint-disable new-cap */
var moment = require('moment');
var models = require('../models');

const formatDate = 'YYYY-DD-MM hh:mm:ss';
function recordService() {
  function getMinutes(arrivaltime, departuretime) {
    const startTime = moment(arrivaltime, formatDate);
    const endTime = moment(departuretime, formatDate);
    var duration = moment.duration(endTime.diff(startTime));
    return duration.asMinutes();
  }

  async function updateDepartureTime(id, departuretime) {
    try {
      const current = await models.Record
        .findById(id);
      current.departuretime = departuretime;
      current.duration = getMinutes(current.arrivaltime, departuretime);
      current.save();

      return new Promise((resolve) => {
        resolve(current);
      });
    }
    catch (e) {
      return new Promise(() => {
        throw e;
      });
    }
  }

  return {
    updateDepartureTime
  };
}


module.exports = recordService();
