
const mongoDb = require('../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

async function resultdbTest() {
    // console.log( await ( mongoDb.insertDocuments('users',[{nombre:'david', apellido:'chami'},{nombre:'jose',apellido:'chami'}] ) ) )
    // console.log( await mongoDb.updateDocuments('users',{nombre:'david'}, {nombre:'Moshe David'}) )
    // console.log( await ( mongoDb.deleteDocuments('products',{_id: new ObjectId("660c186d2d955ce8ac055477")}) ) )
    console.log( await mongoDb.findDocuments('products') )
    console.log( await mongoDb.finalizarConexion() )
}
// resultdbTest()


module.exports = {
    carrito: async(req, res) => {

        res.render('pedidos/carrito', { user:req.session.userLogged })
    },
    adminPedidos: async(req, res) => {
        let pedidos = await mongoDb.findDocuments('pedidos')

        res.render('pedidos/adminPedidos', { user:req.session.userLogged, pedidos })
    },
    detallePedido: async(req, res) => {
        let idPedido = String(req.params.idPedido)
        let external_reference = Number(req.query.externalReference)
        let user = req.session.userLogged
        let pedidos
        if (idPedido != '0') {
            pedidos = await mongoDb.findDocuments('pedidos', {_id: new ObjectId(idPedido)})
        } else {
            pedidos = await mongoDb.findDocuments('pedidos', {external_reference})
        }
        let message = ''
        let pedido = null
        let PublicKey_MercadoPago = process.env.PublicKey_MercadoPago

        if ( pedidos.length == 0 || !idPedido && !external_reference) {
            message = 'Pedido no encontrado'
        } else if( !user ) {
            message = 'Debe iniciar sesión'
        } else if ( !user.isAdmin || user._id != pedidos[0].idUser ) {
            message = 'Debe tener permisos para ver el contenido'
        } else {
            pedido = pedidos[0]
        }

        res.render('pedidos/detallePedido', { user:req.session.userLogged, message, pedido, PublicKey_MercadoPago })
    },
}