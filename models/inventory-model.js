const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// to retrieve the classification name by classification_id
async function getClassificationName(classification_id) {
  const classificationName = await pool.query(`SELECT classification_name FROM public.classification WHERE classification_id = $1`,[classification_id])
  return classificationName.rows[0].classification_name
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// to retrieve the data for a specific vehicle
async function getVehicleById(id) {
  try{
    const vehicle = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1', [id]
    )
    return vehicle.rows[0];
  } catch(error){
    console.error('getVehicleById error ' + error); 
  }
};

// to add a new classification
async function addClassification(classification_name) {
  try {
      const result = await pool.query(
          'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *', 
          [classification_name]
      );
      return result.rows[0];
  } catch (error) {
      console.error('addClassification error ' + error);
  }
}

// to check if a classification already exists
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

// to add a new inventory item
async function addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

async function searchInventory(term) {
  const data = await pool.query(`SELECT * FROM inventory WHERE inv_make LIKE $1 OR inv_model LIKE $1 OR inv_description LIKE $1`, [`%${term}%`]);
  return data.rows;
}

module.exports = {getClassifications, getClassificationName, getInventoryByClassificationId, getVehicleById, addClassification, checkExistingClassification, addInventory, updateInventory, deleteInventoryItem, searchInventory };