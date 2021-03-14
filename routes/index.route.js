const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/checkJwt');




/* GET home page. */
// router.get('/jwt-test', verify, async (req, res) => {
//   res.status(200).json(req.user);
// });

router.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "BY SATAN IT WORKS!",
  });
});

module.exports = router;
