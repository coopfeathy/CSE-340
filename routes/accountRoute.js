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

router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to build account management view
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

//Route to build account update view
router.get("/update",utilities.handleErrors(accountController.buildAccountUpdate))

//Route to process account update
router.post(
  "/update-account", 
  regValidate.updateAccountRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.accountUpdate)
)

//Route to process password update
router.post(
  "/update-password", 
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.passwordUpdate)
)

//Route to logout
router.get("/logout", utilities.handleErrors(accountController.logout))   

module.exports = router;

