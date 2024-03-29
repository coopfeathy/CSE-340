const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
  * Login Data Validation Rules
  * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.").custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (!emailExists){
      throw new Error("Email does not exist. Please log in using a different email")
    }
    }),
      body("account_password").trim().isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }).withMessage("Password did not meet requirements"),
  ]
}

/* ******************************
  * Check data and return errors or continue to login
  * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const {account_email} = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email, //for stickiness 
      })
      return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

// Rules for update account
validate.updateAccountRules = () => {
  return [
      body("account_firstname").trim().isLength({ min: 1}).withMessage("Please provide a first name"),
      body("account_lastname").trim().isLength({ min: 1}).withMessage("Please provide a last name"),
      body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.").custom(async(account_email) => {
          const emailExists = await accountModel.checkExistingEmailUpdate(account_email)

           if (emailExists) 
          {
              throw new Error("Email exists. Please use a different email")
          }
      })
  ]
}

validate.checkAccountUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const AccountName = account_firstname + " " + account_lastname
      res.status(501).render("account/update",{
          errors,
          title: `Update ${AccountName}'s  account information`,
          nav,
          account_firstname : account_firstname,
          account_lastname : account_lastname,
          account_email : account_email,
          account_id : account_id
        })
      return
  }
  next()
}

validate.updatePasswordRules = () => {
  return [
      body("account_password").trim().isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
      }).withMessage("Password did not meet requirements"),
  ]
}

validate.checkPasswordUpdate = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountDetailsById(account_id)
      const AccountName = data.account_firstname + " " + data.account_lastname
      res.status(501).render("account/update",{
          errors,
          title: `Update ${AccountName}'s  account information`,
          nav,
          account_firstname : data.account_firstname,
          account_lastname : data.account_lastname,
          account_email : data.account_email,
          account_id : account_id,
        })
      return
  }
  next()
}


module.exports = validate