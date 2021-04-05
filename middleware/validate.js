const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

// {
//   "errors": {
//       "email or password": [
//           "is invalid"
//       ]
//   }
// }

// {
//   "errors": [
//       {
//           "user.email": "Invalid value"
//       },
//       {
//           "user.password": "Invalid value"
//       }
//   ]
// }
