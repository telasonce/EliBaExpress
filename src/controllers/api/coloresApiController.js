
const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;


module.exports = {
    getColores: async (req,res)=>{

        try {
            let resultDb = await mongoDb.findDocuments('colores')
            if (resultDb.length >= 1) {
                resultDb.sort(function (a, b) {
                    if (a.color > b.color) {
                      return 1;
                    }
                    if (a.color < b.color) {
                      return -1;
                    }
                    return 0;
                  });
            }
            res.json({ message:'get colores', status:'ok', data:resultDb })
          
        } catch (error) {
            res.json({error:error, message:'Ocurrio un problema ' + error.message, body:req.body})
        }
    },
    insertColor: async (req,res)=>{

        try {
            let newColor = req.body.newColor || {}
            let response = await mongoDb.insertDocuments('colores', [newColor])

            res.json({ message:'save new color', status:'ok', data:response })
          
        } catch (error) {
            res.json({error:error, message:'Ocurrio un problema ' + error.message, body:req.body})
        }
    },
    updateColor: async (req,res)=>{

        try {
            let idColor = String(req.body.idColor)
            let data = req.body.data
            let response = await mongoDb.updateDocuments('colores', {_id: new ObjectId(idColor)}, data)

            res.json({ message:'update color', status:'ok', data:response })
          
        } catch (error) {
            res.json({error:error, message:'Ocurrio un problema ' + error.message, body:req.body})
        }
    },
    deleteColor: async (req,res)=>{

        try {
            let idColor = String(req.body.idColor)
            let response = await mongoDb.deleteDocuments('colores', {_id: new ObjectId(idColor)})

            res.json({ message:'delete color', status:'ok', data:response })
          
        } catch (error) {
            res.json({error:error, message:'Ocurrio un problema ' + error.message, body:req.body})
        }
    },



}