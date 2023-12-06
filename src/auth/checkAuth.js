const { findById } = require("../services/apiKey.service");

const HEADER = {
  APIKEY:'x-api-key',
  AUTHORIZATION:'authorization',
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.APIKEY]?.toString()
    
    if(!key){
      return res.status(403).json({
        message: 'Forbidden'
      })
    }

    const objKey = await findById(key);

    if(!objKey){
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.objKey = objKey;
    
    return next();
  } catch (error) {
    
  }
}

const permission = ( permission ) => {
  return (req, res, next) => {
    if(!req.objKey.permission){
      return res.status(403).json({ message: 'no permission'});
    }

    const validPermissions = req.objKey.permission.includes(permission);
    if(!validPermissions){
      return res.status(403).json({ message: 'permissions denied' });
    }

    return next();
  }
}

module.exports = {
  apiKey,
  permission,
}