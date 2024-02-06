const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let grid
  if (data.length >= 1){
      grid = await utilities.buildClassificationGrid(data)
      let nav = await utilities.getNav()
      const className = data[0].classification_name
      res.render("./inventory/classification", {
          title: className + " vehicles",
          nav,
          grid,
  })
  } else {
      grid = `<h2 class="notice">Sorry, we currently have no cars for this type of vehicle. </h2>`
      let nav = await utilities.getNav()
      const className = await invModel.getClassificationName(classification_id)
      res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
  })
  }
}


/* ***************************
 *  Build vehicleDetail view
 * ************************** */
invCont.getVehicleById = async (req, res) => {
  const vehicle = await invModel.getVehicleById(req.params.id);
  const vehicleHtml = utilities.buildVehicleHtml(vehicle);
  let nav = await utilities.getNav();
  res.render('./inventory/vehicleDetail', { 
    title: vehicle.inv_make + ' ' + vehicle.inv_model,
    nav,
    vehicleHtml
  });
};

/* ***************************
 *  Build mangement view
 * ************************** */
invCont.buildManagement = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  });
}

/* ***************************
  *  Build AddClassification view
  * ************************** */ 
invCont.buildAddClassification = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
  });
}

// Process the add classification data
invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body

  const addClassResult = await invModel.addClassification(classification_name) 
  if (addClassResult) 
  {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you successfully added the new classification "${classification_name}".`)
      res.status(201).render("./inventory/management",{
          title: "Inventory Management",
          nav,
          errors: null
        })
  } else 
  {
    req.flash("notice", "Sorry, addition failed, please verify the information and try again.")
    res.status(501).render("./inventory/add-classification",{
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
  *  Build AddInventory view
  * ************************** */ 
invCont.buildAddInventory = async (req, res) => {
  let nav = await utilities.getNav();
  let classifications = await utilities.buildOptions();
  res.render('./inventory/add-inventory', { 
    title: 'Add Vehicle', 
    nav,
    options: classifications, 
  });
};

invCont.addInventory = async function (req, res) {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const addClassResult = await invModel.addInventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 

  if (addClassResult){
    let nav = await utilities.getNav()
    req.flash("notice", `Congratulations, you successfully added the "${inv_year} ${inv_make} ${inv_model}".`)
    res.status(201).render("./inventory/management",{
        title: "Inventory Management",
        nav,
        errors: null
    })
  } else {
    let classifications = await utilities.buildOptions()
    req.flash("notice", "Sorry, addition failed, please verify the information and try again.")
    res.status(501).render("./inventory/add-inventory",{
      title: "Add Inventory",
      nav,
      errors: null,
      options: classifications
    })
  }
}

module.exports = invCont