// usersApiController

const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;


module.exports = {
    bloquearUsuario: async (req,res)=>{

        try {
            let idUser = req.body.idUser.length == 24 ? String(req.body.idUser) : ''
            if (idUser) {
                let resultDb = await mongoDb.updateDocuments('users',{_id:new ObjectId(idUser)},{isActive: false})
                res.json({ message:'Usuario Bloqueado', status:'ok', data:resultDb })
                
            } else {
                res.json({error:error, message:'No se bloqueo el usuario, error con el id ', body:req.body})
            }

        } catch (error) {
            res.json({error:error, message:'No se bloqueo el usuario: ' + error.message, body:req.body})
        }
    },
    activarUsuario: async (req,res)=>{

        try {
            let idUser = req.body.idUser.length == 24 ? String(req.body.idUser) : ''
            if (idUser) {
                let resultDb = await mongoDb.updateDocuments('users',{_id:new ObjectId(idUser)},{isActive: true})
                res.json({ message:'Usuario Activado', status:'ok', data:resultDb })
                
            } else {
                res.json({error:error, message:'No se activo el usuario, error con el id ', body:req.body})
            }

        } catch (error) {
            res.json({error:error, message:'No se activo el usuario: ' + error.message, body:req.body})
        }
    },
    asignarAdministradorUsuario: async (req,res)=>{

        try {
            let idUser = req.body.idUser.length == 24 ? String(req.body.idUser) : ''
            if (idUser) {
                let resultDb = await mongoDb.updateDocuments('users',{_id:new ObjectId(idUser)},{isAdmin: true})
                res.json({ message:'Usuario Asignado como administrador', status:'ok', data:resultDb })
                
            } else {
                res.json({error:error, message:'No se asigno al usuario, error con el id ', body:req.body})
            }

        } catch (error) {
            res.json({error:error, message:'No se asigno al usuario: ' + error.message, body:req.body})
        }
    },
    desasignarAdministradorUsuario: async (req,res)=>{

        try {
            let idUser = req.body.idUser.length == 24 ? String(req.body.idUser) : ''
            if (idUser) {
                let resultDb = await mongoDb.updateDocuments('users',{_id:new ObjectId(idUser)},{isAdmin: false})
                res.json({ message:'Usuario desasignado como administrador', status:'ok', data:resultDb })
                
            } else {
                res.json({error:error, message:'No se asigno al usuario, error con el id ', body:req.body})
            }

        } catch (error) {
            res.json({error:error, message:'No se asigno al usuario: ' + error.message, body:req.body})
        }
    },


}