
const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;


module.exports = {
    guardarQueryBusqueda: async (req,res)=>{

        try {
            let queryBusqueda = req.body.queryBusqueda

            let response = await mongoDb.insertDocuments('busquedas', [{q:queryBusqueda}])

            res.json({ message:'save query Busqueda', status:'ok', data:response })
          
        } catch (error) {
            res.json({error:error, message:'Ocurrio un problema ' + error.message, body:req.body})
        }
    },

    getBusquedas: async (req,res)=>{

        try {
            let resultDb = await mongoDb.findDocuments('busquedas')

            res.json({ message:'Busquedas', status:'ok', data:resultDb })
          
        } catch (error) {
            res.json({error:error, message:'Ocurrio un problema ' + error.message, body:req.body})
        }
    },


}