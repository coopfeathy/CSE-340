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
  let classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect
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
    let classificationSelect = await utilities.buildClassificationList();
    req.flash(
      "notice",
      `Congratulations, you successfully added the new classification "${classification_name}".`)
      res.status(201).render("./inventory/management",{
          title: "Inventory Management",
          nav,
          classificationSelect,
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
  let classifications = await utilities.buildClassificationList();
  res.render('./inventory/add-inventory', { 
    title: 'Add Vehicle', 
    nav,
    options: classifications, 
  });
};

// Process the add inventory data
invCont.addInventory = async function (req, res) {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const addClassResult = await invModel.addInventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 

  let nav = await utilities.getNav()

  if (addClassResult){
    let classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", `Congratulations, you successfully added the "${inv_year} ${inv_make} ${inv_model}".`)
    res.status(201).render("./inventory/management",{
        title: "Inventory Management",
        nav,
        classificationSelect,
        errors: null
    })
  } else {
    let classifications = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, addition failed, please verify the information and try again.")
    res.status(501).render("./inventory/add-inventory",{
      title: "Add Inventory",
      nav,
      errors: null,
      options: classifications
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getVehicleById(inv_id)
  let name = `${data.inv_make} ${data.inv_model}`
  let select = await utilities.buildClassificationList(data.classification_id)
  res.render("inventory/edit-inventory",{
    title: `Edit ${name}`,
    nav,
    errors: null,
    options: select,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

// Update Inventory Data
invCont.updateInventory = async function (req, res) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  let nav = await utilities.getNav()

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      options: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/**
 * Build and deliver the delete confirmation view.
 */
invCont.showDeleteConfirmation = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav()
  const inventoryItem = await invModel.getVehicleById(inv_id);
  const name = `${inventoryItem.inv_make} ${inventoryItem.inv_model}`;

  res.render('inventory/delete-confirm', {
      title: 'Delete ' + name + '?',
      nav: nav,
      errors: null,
      inv_id: inv_id,
      inv_make: inventoryItem.inv_make,
      inv_model: inventoryItem.inv_model,
      inv_year: inventoryItem.inv_year,
      inv_price: inventoryItem.inv_price
  });
}

/**
 * Carry out the delete of the inventory item.
 */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const inventoryItem = await invModel.getVehicleById(inv_id);
  const name = `${inventoryItem.inv_make} ${inventoryItem.inv_model}`;
  const result = await invModel.deleteInventoryItem(inv_id);
  let nav = await utilities.getNav()

  if (result){
    let classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", 'Inventory item deleted successfully.')
    res.status(201).render("./inventory/management",{
        title: "Inventory Management",
        nav,
        classificationSelect,
        errors: null
    })
  } else {
    req.flash("notice", "Failed to delete inventory item.")
    res.status(501).render('inventory/delete-confirm', {
      title: 'Delete ' + name + '?',
      nav: nav,
      errors: null,
      inv_id: inv_id,
      inv_make: inventoryItem.inv_make,
      inv_model: inventoryItem.inv_model,
      inv_year: inventoryItem.inv_year,
      inv_price: inventoryItem.inv_price
  });
  }
}

module.exports = invCont