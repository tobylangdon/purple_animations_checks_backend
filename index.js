const express = require('express')
const Datastore = require('nedb');
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const db = new Datastore({filename: 'anims.db',  autoload: true});

db.loadDatabase(function(err) {
    console.log(err)
    // Start issuing commands after callback...
});

const returnAll = () => {
    db.find({}, (err, allDocuments) => {
        if (err) {
          console.error('Error during find operation:', err);
          return false
          // Handle the error
        } else {
          console.log('All documents:', allDocuments);
          return allDocuments
          // Do something with the retrieved documents
        }
      });
}

const port = 4000;

app.get('/', (req, res) => {
    res.send('Hello')
})
app.get('/api/anim', (req, res) => {
    db.find({}, (err, allDocuments) => {
        if (err) {
          console.error('Error during find operation:', err);
          return false
          // Handle the error
        } else {
          console.log('All documents:', allDocuments);
          allDocuments.sort((a, b) => a.image_id - b.image_id)
          res.send(allDocuments)
          // Do something with the retrieved documents
        }
      });
})

app.post('/api/anim', (req, res) => {
    const newData = req.body

    try{
        db.findOne({ image_id: newData.image_id }, (err, doc) => {
            if (err) {
            console.error('Error during findOne operation:', err);
            // Handle the error
            } else {
            if (doc) {
                console.log(`Document with id ${newData.image_id} exists:`, doc);
                db.update({ image_id: newData.image_id }, { $set: newData }, {}, (err, numAffected, affectedDocuments) => {
                    if (err) {
                      console.error('Error during update operation:', err);
                      // Handle the error
                    } else {
                        db.find({}, (err, allDocuments) => {
                            if (err) {
                              console.error('Error during find operation:', err);
                              return false
                              // Handle the error
                            } else {
                              console.log('All documents:', allDocuments);
                              allDocuments.sort((a, b) => a.image_id - b.image_id)
                              res.send(allDocuments)
                              // Do something with the retrieved documents
                            }
                          });
                    }
                });
                // Do something if the document exists
            } else {
                db.insert(newData, function(err, doc) {
                    if(err){
                        console.log(err)
                    }
                    db.find({}, (err, allDocuments) => {
                        if (err) {
                          console.error('Error during find operation:', err);
                          return false
                          // Handle the error
                        } else {
                          console.log('All documents:', allDocuments);
                          allDocuments.sort((a, b) => a.image_id - b.image_id)
                          res.send(allDocuments)
                          // Do something with the retrieved documents
                        }
                      });
                    console.log('Inserted image id', doc.image_id, 'with ID', doc._id);
                });
                // Do something if the document does not exist
            }
            }
        });
    }
    catch(err){
        res.send(err)
    }


})

app.listen(port, () => {
    console.log('Listening on http://localhost:4000')
})