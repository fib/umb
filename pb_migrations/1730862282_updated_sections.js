/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mcgtq89wt9prvk5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qhmqcqxo",
    "name": "instructor",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "is6mszvt",
    "name": "location",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mcgtq89wt9prvk5")

  // remove
  collection.schema.removeField("qhmqcqxo")

  // remove
  collection.schema.removeField("is6mszvt")

  return dao.saveCollection(collection)
})
