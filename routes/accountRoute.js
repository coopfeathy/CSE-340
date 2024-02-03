// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

// Route 
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/registration", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.get('/error', (req, res, next) => {
    next(new Error('Intentional Error'));
});

module.exports = router;
