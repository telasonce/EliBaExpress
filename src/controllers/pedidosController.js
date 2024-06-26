
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

// const mercadoPagoApiController = require('../controllers/api/mercadoPagoApiController')

module.exports = {
    carrito: async(req, res) => {

        res.render('pedidos/carrito', { user:req.session.userLogged })
    },
    adminPedidos: async(req, res) => {
        let pedidos = await mongoDb.findDocuments('pedidos')
        let arrayPedidos = []
        // eliminar pedidos si pasaron 10 dias, isCancelled ,statusPago not paid
        for (let index = 0; index < pedidos.length; index++) {
            const pedido = pedidos[index];
            if (pedido.isCancelled && pedido.statusPago != 'paid' && ( Date.now() - pedido.createdAt > 432000000)) {
                 await ( mongoDb.deleteDocuments('pedidos',{_id: new ObjectId( String(pedido._id) )}) ) 
            } else {
                arrayPedidos.push(pedido)
            }
        }
        res.render('pedidos/adminPedidos', { user:req.session.userLogged, pedidos:arrayPedidos })
    },
    misPedidos: async(req, res) => {
        let user = req.session.userLogged
        let pedidos
        let message
        if (user) {
            pedidos = await mongoDb.findDocuments('pedidos', {emailUser: user.email})
        } else {
            message = 'Debe Iniciar Sesion para ver sus pedidos'
        }
        res.render('pedidos/misPedidos', { user:req.session.userLogged, pedidos, message })

    },
    detallePedido: async(req, res) => {

        // actualizo y leo las notificaciones
        // let resNotifi = await mercadoPagoApiController.abrirNotificacionesMp()
        //     console.log(resNotifi)
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