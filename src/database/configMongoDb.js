// configMongoDb

require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// Connection URL
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
const dbName = process.env.MONGODB_DBNAME;
let db 

async function conectar() {
    if(!db){
        await client.connect();
        console.log('Db +');
        db = client.db(dbName);
    }
  return 'done.';
}

    const dbFunctions = {
        findDocuments: async (collectionName, data = {})=>{
            let dataResult
                await conectar() .then( async ()=>{
                    const collection = db.collection(collectionName); 
                    const findResult = await collection.find(data).toArray();
                        dataResult = findResult
                } )
                .catch((error)=>{
                    dataResult = error
                    console.error
                })
                return dataResult
            },

        insertDocuments: async (collectionName, data = [{}])=>{
            let dataResult
            await conectar() .then( async ()=>{
                const collection = db.collection(collectionName); 
                const insertResult = await collection.insertMany(data);
                    dataResult = insertResult
            })
                .catch((error)=>{
                    dataResult = error
                    console.error
                })
                return dataResult
            },

        updateDocuments: async (collectionName,document = {}, dataSet = {})=>{
            let dataResult
            await conectar() .then( async ()=>{
                const collection = db.collection(collectionName); 
                const updateResult = await collection.updateMany(document, { $set: dataSet});
                // const updateResult = await collection.updateOne(document, { $set: dataSet});
                    dataResult = updateResult
            } )
                .catch((error)=>{
                    dataResult = error
                    console.error
                })
                return dataResult
            },

        updateDocumentsLibre: async (collectionName,document = {}, dataSet = {})=>{
            let dataResult
            await conectar() .then( async ()=>{
                const collection = db.collection(collectionName); 
                const updateResult = await collection.updateMany(document, dataSet);
                // const updateResult = await collection.updateOne(document, { $set: dataSet});
                    dataResult = updateResult
            } )
                .catch((error)=>{
                    dataResult = error
                    console.error
                })
                return dataResult
            },

        deleteDocuments: async (collectionName,documents = {})=>{
            let dataResult
            await conectar() .then( async ()=>{
                const collection = db.collection(collectionName); 
                const deleteResult = await collection.deleteMany(documents);
                    dataResult = deleteResult
            } )
                .catch((error)=>{
                    dataResult = error
                    console.error
                })
                return dataResult
            },

        finalizarConexion: async ()=>{
            if(db){
                 setTimeout( function(){
                    db = null
                    client.close()
                   console.log('Db -')
                }, 2000)
                    return 'mongo -'

                
            } else{
                return 'mongo vacio'
            }
        },


        }


  module.exports = dbFunctions