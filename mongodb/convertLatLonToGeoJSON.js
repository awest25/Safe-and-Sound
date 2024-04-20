// targetId used for testing, use {} to select all documents
// var targetId = ObjectId('662359cd4f4b4cbcca3a4791')

// set geometry
db.crime.updateMany(
  { "_id": targetId },
  [
    {
      $set: {
        "geometry": {
          "type": "Point",
          "coordinates": ["$LAT", "$LON"]
        }
      }
    }
  ]
)

// remove geometry
db.crime.updateMany(
  { "_id": targetId },
  {
    $unset: {
      "geometry": ""
    }
  }
)