// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validate = require("../utilities/add-inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:id", utilities.handleErrors(invController.getVehicleById));

// Route to build inventory management view
router.get('/', utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification data
router.post(
  '/add-classification',
  validate.classAddRules(),
  validate.checkClassificationAddition, 
  utilities.handleErrors(invController.addClassification));

// Route to build add inventory view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory data
router.post(
  '/add-inventory',
  validate.addInventoryRules(),
  validate.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;

