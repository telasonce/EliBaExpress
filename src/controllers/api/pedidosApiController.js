
const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;

const MercadoPago = require('../api/mercadoPagoApiController')

module.exports = {
    verificarCarrito: async(req, res) => {
        try {
            let products = await mongoDb.findDocuments('products', {isActive:true})
            let colores =  await mongoDb.findDocuments('colores')

            // console.log(products)
            // console.log(colores)
            let productsDisponiblesOnline = await products.filter( product =>{
                if (product.stock && product.stock.length >= 1) {
                    return product
                }
            } )

            let carrito = req.body.carrito || []
            let carritoVerificado = []
            let carritoAmostrar = []

            await carrito.map( item => {
                productsDisponiblesOnline.forEach( product => {
                    product.stock.map( stock =>{
                        if (item.codStock == stock.codStock) {
                            stock.disponibilidad.map( disponibilidad => {
                                if (disponibilidad.cod == item.cod && disponibilidad.cantidadDisponible >= item.cantidad && disponibilidad.isActive) {
                                    carritoVerificado.push(item)
                                    carritoAmostrar.push({itemCarrito:item, disponibilidad, product, stock})
                                } else if(disponibilidad.cod == item.cod && disponibilidad.cantidadDisponible >= 1 && disponibilidad.isActive) {
                                    item.cantidad = 1
                                    carritoVerificado.push(item)
                                    carritoAmostrar.push({itemCarrito:item, disponibilidad, product, stock})
                                }
                            } )
                        }
                    } )
                });
            })

            // eliminar duplicados
            var hash = [];
            carritoVerificado = await carritoVerificado.filter( async function(element) {
                if (!hash.includes(element.cod)) {
                    hash.push(element.cod)
                    return element
                }
            });

            res.json({ message:'Get pruducts, carrito, colores', status:'ok', data: {allProducts:products, colores, productsDisponiblesOnline, carritoVerificado, carritoAmostrar} })
        } catch (error) {
            console.log(error)
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    realizarPedido: async(req, res) => {
        try {
            let user = req.session.userLogged
            let carrito = req.body.carrito || []
            let products = await mongoDb.findDocuments('products', {isActive:true})
            
            if (user && carrito && carrito.length >= 1) {
                
            

            let productsDisponiblesOnline = await products.filter( product =>{
                if (product.stock && product.stock.length >= 1) {
                    return product
                }
            } )

            // let carritoVerificado = []
            // let carritoAmostrar = []
            let pedido = []
            let totalPedido = 0

            await carrito.map( item => {
                productsDisponiblesOnline.forEach( product => {
                    product.stock.map( stock =>{
                        if (item.codStock == stock.codStock) {
                            stock.disponibilidad.map( disponibilidad => {
                                if (disponibilidad.cod == item.cod && disponibilidad.cantidadDisponible >= item.cantidad && disponibilidad.isActive) {
                                    pedido.push({
                                        idProducto: product._id,
                                        titulo: product.titulo,
                                        unidadDeMedida: product.unidadDeMedida,
                                        descripcionStock: stock.descripcion,
                                        precio: stock.precio,
                                        codStock: stock.codStock,
                                        medida: disponibilidad.medida,
                                        cod: disponibilidad.cod,
                                        color: disponibilidad.color,
                                        cantidad: item.cantidad,
                                        total: (item.cantidad * stock.precio * disponibilidad.medida)
                                    })
                                    totalPedido += (item.cantidad * stock.precio * disponibilidad.medida)
                                } else if(disponibilidad.cod == item.cod && disponibilidad.cantidadDisponible >= 1 && disponibilidad.isActive) {
                                    item.cantidad = 1
                                    pedido.push({
                                        idProducto: product._id,
                                        titulo: product.titulo,
                                        unidadDeMedida: product.unidadDeMedida,
                                        descripcionStock: stock.descripcion,
                                        precio: stock.precio,
                                        codStock: stock.codStock,
                                        medida: disponibilidad.medida,
                                        cod: disponibilidad.cod,
                                        color: disponibilidad.color,
                                        cantidad: item.cantidad,
                                        total: (item.cantidad * stock.precio * disponibilidad.medida)
                                    })
                                    totalPedido += (item.cantidad * stock.precio * disponibilidad.medida)
                                }
                            } )
                        }
                    } )
                });
            })

            // eliminar duplicados
            var hash = [];
            pedido = await pedido.filter( async function(element) {
                if (!hash.includes(element.cod)) {
                    hash.push(element.cod)
                    return element
                }
            });

            // creo la preferencia en MP
            let external_reference = Date.now()
            let PreferenciaId = await MercadoPago.crearPreferenciaId(external_reference, totalPedido)
                // console.log('PreferenciaId')
                // console.log(PreferenciaId)
            let dataNewPedido = {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                estados:[ {date: Date.now(), msg:'Esperando Pago'} ],
                pedido: pedido,
                totalPedido,
                pagos:[],
                idUser: user._id,
                emailUser: user.email,
                datosEnvio:[],
                comentarios:[],
                statusPago: 'pendiente',
                PREFERENCE_ID: PreferenciaId.id,
                external_reference
            }

            let resDB = await mongoDb.insertDocuments('pedidos', [dataNewPedido])


            res.json({ message:' Pedido Guardado ', status:'ok', data: {pedido, resDB, dataNewPedido} })
        } else {
            res.json({ message:'Por Favor inicie sesion y cargue su pedido', status:'error', data: 'Debe Iniciar sesion y cargue su pedido' })
        }
        } catch (error) {
            console.log(error)
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }


    },
    cancelarPedido: async(req,res) => {
        let idpedido = String(req.body.idpedido)
        try {
            let response = await mongoDb.updateDocuments('pedidos', {_id: new ObjectId(idpedido)}, {isCancelled: true})
            res.json({status:'ok', message:'Pedido Cancelado', response})
            
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }
    },

    guardarComentario: async(req,res) => {
        let idpedido = String(req.body.idpedido)
        let comentario = req.body.comentario
        try {
            let pedidos = await mongoDb.findDocuments('pedidos', {_id: new ObjectId(idpedido)})
            let response2
            if (pedidos.length > 0 && pedidos[0].comentarios.length < 3) {
                 response2 = await mongoDb.updateDocumentsLibre('pedidos',{_id: new ObjectId(idpedido)},{ $push: { comentarios: {comentario } } })
                 res.json({status:'ok', message:'comentario guardado en el Pedido ', response2, body:req.body})
                } else {
                res.json({status:'error', message:'Envie comentarios por otro medio', response2, body:req.body})
            }
            
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }
    },
    guardarDatosDeEnvio: async(req,res) => {
        let idpedido = String(req.body.idpedido)
        let data = req.body.data
        try {
            let response = await mongoDb.updateDocuments('pedidos',{_id: new ObjectId(idpedido)}, {datosEnvio:data}  )
            res.json({status:'ok', message:'Datos guardados correctamente', body:req.body, response})
            
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }
    },

    verficarMerchantOrder: async(req,res) => {
        let idpedido = String(req.body.idpedido)
        try {
            let pedidos = await mongoDb.findDocuments('pedidos',{_id: new ObjectId(idpedido)} )
            if (pedidos.length > 0) {
                let data = {
                    queryId:pedidos[0].merchant_order_id, topic:'merchant_order', open: false
                }
                let resDb = await mongoDb.insertDocuments('notificacionesMp', [data])
                res.json({status:'ok', message:'Notificacion guardada correctamente', body:req.body, resDb})
            } else {
                res.json({status:'error', message:'Pedido no encontrado', body:req.body})
            }
            
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }
    },
}