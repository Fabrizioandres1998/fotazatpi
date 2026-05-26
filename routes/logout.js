let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
  res.render('logout');
});

router.post("/", (req, res) => {

  req.session.destroy(() => {
    res.send("Logout correcto");
  });

});

module.exports = router;