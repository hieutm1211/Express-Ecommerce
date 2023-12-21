'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {}}) => {
  return _.pick(object, fields);
}

// [a, b] => {a: 1, b: 1}
const getSelectedData = ( select = [] ) => {
  return Object.fromEntries(select.map(el => [el, 1]));
}

// [a, b] => {a: 1, b: 1}
const unSelectedData = ( select = [] ) => {
  return Object.fromEntries(select.map(el => [el, 0]));
}

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach( k => {
    if(obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
}
/*
const a = {
  c: {
    d: 1
  }
}

db.collection.updateOne({
  `c.d`: 1
})
*/
const updateNestedObjectParser = obj => {
  const final = {};

  Object.keys(obj).forEach( k => {
    if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const unNestedObject = updateNestedObjectParser(obj[k]);

      Object.keys(unNestedObject).forEach(a => {
        final[`${k}.${a}`] = unNestedObject[a]
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log('final', final)
  return final;
}

module.exports = {
  getInfoData,
  getSelectedData,
  unSelectedData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb
}