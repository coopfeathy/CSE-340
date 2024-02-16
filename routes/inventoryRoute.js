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
router.get('/', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get('/add-classification', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification data
router.post(
  '/add-classification',
  validate.classAddRules(),
  validate.checkClassificationAddition, 
  utilities.handleErrors(invController.addClassification));

// Route to build add inventory view
router.get('/add-inventory', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory data
router.post(
  '/add-inventory',
  validate.addInventoryRules(),
  validate.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to process the get inventory request with JSON 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get('/edit/:inv_id', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));

// Route to process update inventory data
router.post(
  '/update/',
  validate.addInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to show delete confirmation view
router.get('/delete/:inv_id', utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.showDeleteConfirmation));

// Route to handle delete process
router.post('/delete/:inv_id', utilities.handleErrors(invController.deleteInventoryItem));

// Route to build search view
router.get('/search', utilities.handleErrors(invController.buildSearch));

// Route to process search request
router.get('/search/results', utilities.handleErrors(invController.search));


module.exports = router;

