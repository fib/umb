/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rla5ln4ht5202ms")

  collection.name = "courses"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rla5ln4ht5202ms")

  collection.name = "classes"

  return dao.saveCollection(collection)
})
