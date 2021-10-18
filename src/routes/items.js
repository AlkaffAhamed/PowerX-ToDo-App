const express = require('express')
const Item = require('../models/item')

module.exports = (db) => {
  const router = express.Router()
  
  /**
   * @openapi
   * components:
   *  schemas:
   *    Item:
   *      type: object
   *      required:
   *        - name
   *        - quantity
   *      properties:
   *        name:
   *          type: string
   *        quantity:
   *          type: integer
   */

  /**
   * @openapi
   * /items:
   *  post:
   *    tags:
   *    - items
   *    description: Create an item
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Item'
   *    responses:
   *      201:
   *        description: Created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Item'
   */
  router.post('/', async (req, res, next) => {
    const uid = req.uid
    const { name, is_deleted } = req.body
    // const list_access_int = list_access.map(Number)
    // console.log(list_access, list_access_int)
    const newItem = new Item({ name, is_deleted, uid })
    const item = await db.insertItem(newItem)
    res.status(201).send(item)
  })

  /**
   * @openapi
   * /items:
   *  get:
   *    tags:
   *    - items
   *    description: Get all items
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Item'
   */
  router.get('/', async (req, res, next) => {
    const uid = req.uid
    const items = await db.findAllItems(uid)
    res.send(items)
  })

  /**
   * @openapi
   * /items/{id}:
   *  get:
   *    tags:
   *    - items
   *    description: Get item
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Item'
   */
  router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const uid = req.uid
    const item = await db.findItem(id)
    if (item) {
      // Check if this item belongs to authenticated user first
      if (item.uid != uid)
      {
        res.status(403).send(`Item id ${id} doesn't belong to user id ${uid}`)
      }
      else
      {
        res.send(item)
      }
    } 
    else 
    {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  /**
   * @openapi
   * /items/{id}:
   *  put:
   *    tags:
   *    - items
   *    description: Update an item
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/Item'
   *    responses:
   *      200:
   *        description: OK
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Item'
   */
  router.put('/:id', async (req, res, next) => {
    const uid = req.uid
    const id = req.params.id
    const { name, is_deleted } = req.body
    // Check if this item exist first 
    const testItem = await db.findItem(id)
    if (testItem) {
      // Check if this item belongs to authenticated user first
      if (testItem.uid != uid)
      {
        res.status(403).send(`Item id ${id} cannot be modified by user id ${uid}`)
      }
      else
      {
        // Proceed with update query 
        const updatedItem = new Item({ name, is_deleted, uid })
        const item = await db.updateItem(id, updatedItem)
        res.send(item)
      }
    } 
    else 
    {
      res.status(400).send(`Item id ${id} not found, cannot be updated`)
    }
  })

  /**
   * @openapi
   * /items/{id}:
   *  delete:
   *    tags:
   *    - items
   *    description: Delete an item
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *    responses:
   *      200:
   *        description: OK
   */
  router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    const uid = req.uid
    // Check if this item exist first 
    const testItem = await db.findItem(id)
    console.log(testItem)
    if (testItem) {
      // Check if this item belongs to authenticated user first
      console.log(testItem.uid, uid, testItem.uid != uid)
      if (testItem.uid != uid)
      {
        res.status(403).send(`Item id ${id} cannot be deleted by user id ${uid}`)
      }
      else
      {
        // Proceed with soft-delete
        const success = await db.deleteItem(id)
        if (success) {
          res.send(`Deleted item ${id} successfully`)
        } else {
          res.status(400).send(`Item id ${id} not found`)
        }
      }
    } 
    else 
    {
      res.status(400).send(`Item id ${id} not found, cannot be deleted`)
    }
  })

  return router
}