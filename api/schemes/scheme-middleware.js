const db = require('../../data/db-config');

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const checkId = await db('schemes')
    .where('scheme_id', req.params.scheme_id)
    .first()
  if (!checkId){
    res.status(404)
      .json({message: `scheme with scheme_id ${req.params.scheme_id} not found`})
    return;
  } else {
  next();
  }
  }

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if (req.body.scheme_name == null || typeof req.body.scheme_name != 'string'  || !req.body.scheme_name.trim() ){
    res.status(400).json({message: "invalid scheme_name"})
    return;
  }
  next();
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const {instructions, step_number} = req.body
  if (instructions == null || instructions == "" || typeof instructions !== 'string' || typeof step_number !== 'number' || step_number < 1){
    res.status(400).json({message: 'invalid step'})
    return;
  }
  
  next();
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep
}
