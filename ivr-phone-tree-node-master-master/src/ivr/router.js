const Router = require('express').Router;
const {welcome, menu, mainnums} = require('./handler');

const router = new Router();

// POST: /ivr/welcome
router.post('/welcome', (req, res) => {
  res.send(welcome());
});

// POST: /ivr/menu
router.post('/menu', (req, res) => {
  const digit = req.body.Digits;
  return res.send(menu(digit));
});

// POST: /ivr/mainnums
router.post('/mainnums', (req, res) => {
  const digit = req.body.Digits;
  res.send(mainnums(digit));
});

module.exports = router;
