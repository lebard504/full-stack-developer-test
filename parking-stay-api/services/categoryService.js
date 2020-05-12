/* eslint-disable new-cap */
var models = require('../models');

function categoryService() {
  async function createOne(body) {
    const model = new models.Category(body);
    try {
      const data = await model.save();

      return new Promise((resolve) => {
        resolve(data);
      });
    }
    catch (e) {
      return new Promise((resolve) => {
        resolve(
          e
        );
      });
    }
  }

  async function getById(id) {
    try {
      const entity = await models.Category.findById(id);
      if (entity) {
        return new Promise((resolve) => {
          resolve(entity);
        });
      }
      throw new Error(`Not found with id: ${id}`);
    }
    catch (e) {
      return new Promise(() => {
        throw new Error(e.message);
      });
    }
  }

  async function getLastByName(name, dummy = null) {
    try {
      const entity = await models.Category.findOne({
        name
      });

      // If does not exist by nature, create dummy
      if (!entity) {
        const createdDummy = await createOne(dummy);
        return new Promise((resolve) => {
          resolve(createdDummy);
        });
      }
      return new Promise((resolve) => {
        resolve(entity);
      });
    }
    catch (e) {
      return new Promise(() => {
        throw new Error(e.message);
      });
    }
  }

  return {
    createOne, getById, getLastByName
  };
}


module.exports = categoryService();
