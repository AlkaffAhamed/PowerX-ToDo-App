const Item = require('../models/item')

module.exports = (pool) => {
  const db = {}

  db.insertItem = async (item) => {
    const res = await pool.query(
      'INSERT INTO Items (name,is_deleted,uid) VALUES ($1,$2,$3) RETURNING *', 
      [item.name,item.is_deleted, item.uid]
    )
    return new Item(res.rows[0])
  }
  
  db.findAllItems = async (uid) => {
    const res = await pool.query(
      'SELECT * FROM Items WHERE uid=$1 AND is_deleted=$2',
      [uid, false]
    )
    return res.rows.map(row => new Item(row))
  }

  db.findItem = async (id) => {
    const res = await pool.query(
      'SELECT * FROM Items WHERE id = $1 AND is_deleted=$2',
      [id, false]
    )
    return res.rowCount ? new Item(res.rows[0]) : null
  }

  db.updateItem = async (id, item) => {
    const res = await pool.query(
      'UPDATE Items SET name=$2, is_deleted=$3, uid=$4 WHERE id=$1 RETURNING *',
      [id, item.name, item.is_deleted, item.uid]
      //const updatedItem = new Item({ name, list_access, is_deleted, uid })
    )
    return new Item(res.rows[0])
  }

  db.deleteItem = async (id) => {
    const res = await pool.query(
      'UPDATE Items SET is_deleted=$2 WHERE id=$1',
      [id, true]
    )
    return res.rowCount > 0
  }

  return db
}