
const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;


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
}