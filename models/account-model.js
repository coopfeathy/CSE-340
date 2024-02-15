const pool = require('../database/index');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Check if email already exists
* ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

 /*
Return account data using account id 
*/
async function getAccountDetailsById (account_id) {
  try {
    let sql = 'SELECT account_firstname, account_lastname, account_email FROM account WHERE account_id = $1'
    const result = await pool.query(sql
      ,[account_id])
      return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

async function passwordUpdate ( account_password, account_id ){
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
      account_id
    ])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function updateAccount( account_id, account_firstname, account_lastname, account_email ){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email, 
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function checkExistingEmailUpdate(account_email) {
  let data = await this.getAccountByEmail(account_email)
  if (data == undefined) {
    return 0
  }
  let account_id = data.account_id 
  try {
      const sql = "SELECT account_email FROM account WHERE account_id = $1";
      const currentEmail = await pool.query(sql, [account_id])

      if (currentEmail.rowCount === 0) {
          // No existing email found for the given account_id
          return 0
      }

      const oldEmail = currentEmail.rows[0].account_email

      if (oldEmail === account_email) {
          // Email is not being changed, no error
          return false
      } else {
          // Check if the new email already exists
          const newEmail = await pool.query("SELECT * FROM account WHERE account_email = $1", [account_email]);
          if (newEmail.rowCount > 0) {
              throw new Error("Email exists. Please use a different email");
          }
      }
  } catch (error) {
      return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountDetailsById, passwordUpdate, updateAccount, checkExistingEmailUpdate }