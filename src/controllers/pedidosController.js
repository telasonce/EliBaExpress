
const mongoDb = require('../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;

async function resultdbTest() {
    // console.log( await ( mongoDb.insertDocuments('users',[{nombre:'david', apellido:'chami'},{nombre:'jose',apellido:'chami'}] ) ) )
    console.log( await mongoDb.updateDocuments('users',{nombre:'david'}, {nombre:'Moshe David'}) )
    // console.log( await ( mongoDb.deleteDocuments('users',{_id: new ObjectId("65b98c20c1542a001268e78e")}) ) )
    console.log( await mongoDb.findDocuments('users') )
    console.log( await mongoDb.finalizarConexion() )
}
// resultdbTest()


module.exports = {
    carrito: async(req, res) => {
        res.render('pedidos/carrito', { user:req.session.userLogged })
    },
}