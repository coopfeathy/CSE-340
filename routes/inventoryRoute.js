// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:id", invController.getVehicleById);

router.get('/error', (req, res, next) => {
  next(new Error('Intentional Error'));
});

module.exports = router;

