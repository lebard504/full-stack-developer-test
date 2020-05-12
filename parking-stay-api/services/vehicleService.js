/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
var models = require('../models');
const categoryService = require('./categoryService');

var dummyCategories = {
  0: 'No Residente',
  1: 'Residente',
  2: 'Oficial'
};

function vehicleService() {
  async function createNewRecord(arrivaltime) {
    const initialRecord = await models.Record.create({
      arrivaltime,
      departuretime: null,
      duration: 0
    });
    await initialRecord.save();
    return initialRecord;
  }

  async function createOne(dto) {
    try {
      // If category name does not exist, create resource dummy
      const defaultCategory = await categoryService.getLastByName(dummyCategories[0], {
        name: dummyCategories[0],
        description: 'Sed ut perspiciatis unde omnis iste natus sit.',
        byMonth: false,
        percent: 0.5
      });

      const entity = new models.Vehicle({
        carplate: dto.carplate,
        category: defaultCategory._id
      });

      const initialRecord = await createNewRecord(dto.record.arrivaltime);
      entity.records.push(initialRecord);

      const data = await entity.save();
      return new Promise((resolve) => {
        resolve(data);
      });
    }
    catch (e) {
      return new Promise(() => {
        throw e;
      });
    }
  }

  async function addRecord(id, record) {
    try {
      const current = await models.Vehicle.findById(id)
        .populate('records');

      const initialRecord = await createNewRecord(record.arrivaltime);
      current.records.push(initialRecord);

      const data = await current.save();

      return new Promise((resolve) => {
        resolve(data);
      });
    }
    catch (e) {
      return new Promise(() => {
        throw e;
      });
    }
  }

  async function deleteOne(id) {
    let current;
    try {
      current = await models.Vehicle.findById(id);

      if (current) {
        current.remove();
        return new Promise((resolve) => {
          resolve('Deletion was sucessfull!');
        });
      }
      throw new Error(`Not found with id: ${id}`);
    }
    catch (e) {
      return new Promise(() => {
        throw e;
      });
    }
  }

  async function getByPlate(carplate) {
    let current;
    try {
      current = await models.Vehicle.findOne({
        carplate
      }).populate('records');

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

  async function getById(id) {
    let current;
    try {
      current = await models.Vehicle.findById(id)
        .populate('records')
        .populate('category');

      if (!current) {
        throw new Error(`Not found with id: ${id}`);
      }

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

  async function getAll() {
    try {
      const items = await models.Vehicle.find();
      return new Promise((resolve) => {
        resolve(items);
      });
    }
    catch (e) {
      return new Promise(() => {
        throw new Error(e.message);
      });
    }
  }

  async function changeVehicleCategory(carplate, category) {
    // If category name does not exist, create resource dummy
    try {
      const current = await models.Vehicle.findOne({
        carplate
      });

      if (current.category._id.equals(category._id)) {
        throw new Error(`the vehicle is already an ${category.name} category`);
      }

      // Change category nature
      current.category = category._id;
      await current.save();

      return new Promise((resolve) => {
        resolve('The category was successfully changed');
      });
    }
    catch (e) {
      return new Promise(() => {
        throw e;
      });
    }
  }

  async function deleteRecordsByVehicleCategory(category) {
    try {
      await models.Vehicle.find(
        { category: category._id }, async (err, docs) => {
          docs.forEach(async (vehicle) => {
            // eslint-disable-next-line no-shadow
            models.Record.deleteMany({ _id: { $in: vehicle.records } }, (err, result) => {
              if (err) {
                throw err;
              }
              console.log(result);
            });
          });
        }
      );

      return new Promise((resolve) => {
        resolve('Deletion was successful');
      });
    }
    catch (e) {
      return new Promise(() => {
        throw new Error(e.message);
      });
    }
  }

  async function resetRecordTimeByVehicleCategory(category) {
    try {
      await models.Vehicle.find(
        { category: category._id }, async (err, docs) => {
          docs.forEach(async (vehicle) => {
            // eslint-disable-next-line no-shadow
            models.Record.updateMany({ _id: { $in: vehicle.records } }, { $set: { duration: 0 } }, (err, result) => {
              if (err) {
                throw err;
              }
              console.log(result);
            });
          });
        }
      );

      return new Promise((resolve) => {
        resolve('Update was successful');
      });
    }
    catch (e) {
      return new Promise(() => {
        throw new Error(e.message);
      });
    }
  }

  return {
    getByPlate,
    getById,
    getAll,
    createOne,
    deleteOne,
    addRecord,
    changeVehicleCategory,
    deleteRecordsByVehicleCategory,
    resetRecordTimeByVehicleCategory
  };
}


module.exports = vehicleService();
