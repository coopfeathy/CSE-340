const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* build the HTML for the vehicle
* ************************************ */
Util.buildVehicleHtml = (vehicle) => {
  let grid = '<div class="vehicle">';
  grid += '<div class="vehicle-image">';
  grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  grid += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`;
  grid += '</div>';
  grid += '<div class="vehicle-info">';
  grid += `<p>Year: ${vehicle.inv_year}</p>`;
  grid += `<p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
  grid += `<p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`;
  grid += `<p>Description: ${vehicle.inv_description}</p>`;
  grid += '</div>';
  grid += '</div>';
  return grid;
};


/* **************************************
* Build the classification options
* ************************************ */
Util.buildClassificationList = async function(classification_id = "1") {
  const classificationData = await invModel.getClassifications()
  let options = `<select name="classification_id" id="classification_id" class="classificationList" required ><option value="">Classification</option>`
  const classInner = [classificationData.rows]
  classInner[0].forEach(classification => {
      // check if the current option matches the last selected classification_id
      let selected = ""
      if (classification.classification_id == classification_id) {
          selected = "selected" 
      }
      options += `<option value= ${classification.classification_id} ${selected}>${classification.classification_name}</option>`
  })
  options += `</select>`

  return options
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util