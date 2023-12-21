const {
  getSelectedData,
  unSelectedData
} = require("../../utils");

const findAllDiscountCodesSelect = async ({
  limit = 50,
  sort = 'ctime',
  page = 1 ``,
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {
    _id: -1
  } : {
    id: 1
  };
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedData(select))
    .lean();

  return documents;
}

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  sort = 'ctime',
  page = 1 ``,
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {
    _id: -1
  } : {
    id: 1
  };
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectedData(unSelect))
    .lean();

  return documents;
}

const checkDiscountExists = async ({ model, filter} ) => {
  return await model.findOne(filter).lean();
}

module.exports = {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
  checkDiscountExists
}