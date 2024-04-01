
const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;

const imagekit = require('../../functions/imageKit')

async function resultdbTest() {
    // console.log( await ( mongoDb.insertDocuments('products',[{hello:'banana'},{hellowin:'frita',lopez:'gomez'}] ) ) )
    // console.log( await mongoDb.updateDocuments('products',{hello:'banana'},{hellowin:'frita'}) )
    // console.log( await ( mongoDb.deleteDocuments('products',{_id: new ObjectId("65b98c20c1542a001268e78e")}) ) )
    console.log( await mongoDb.findDocuments('products') )
    console.log( await mongoDb.finalizarConexion() )
}
// resultdbTest()

module.exports = {
    getAllProductsActive: async(req, res) => {
        try {
            let products = await mongoDb.findDocuments('products', {isActive:true})
            res.json({ message:'Get pruducts', status:'ok', data: products })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    
    getAllProductsAdmin: async(req, res) => {
        try {
            let products = await mongoDb.findDocuments('products')
            res.json({ message:'Get pruducts admin', status:'ok', data: products })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    reactivarProducto: async(req, res) => {
        let idProduct = String(req.body.idProduct)
        try {
            let products = await mongoDb.updateDocuments('products',{_id: new ObjectId(idProduct)}, {isActive:true})
            res.json({ message:'Activar product', status:'ok', data: products })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    pausarProducto: async(req, res) => {
        let idProduct = String(req.body.idProduct)
        try {
            let products = await mongoDb.updateDocuments('products',{_id: new ObjectId(idProduct)}, {isActive:false})
            res.json({ message:'Pausar product', status:'ok', data: products , idProduct})
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    
    productsGetById: async(req, res) => {
        let idProduct = String(req.params.idProduct)

        try {
            let products = await mongoDb.findDocuments('products', {_id: new ObjectId(idProduct)})
            res.json({ message:'Get pruduct by Id', status:'ok', data: products })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    
    productsCreate: async(req, res) => {
        let dataProduct = req.body.dataProduct
        let data = {
            titulo: dataProduct.titulo,
            descripcion: '',
            isActive: false,
            imagenes: [],
            vistas: 0,
            costo: 0,
            ganancias: [],
            etiquetas: '',
            updatedAt: Date.now()
        }
        try {
            let response = await mongoDb.insertDocuments('products', [data])
            // console.log(response)
            res.json({ message:'Product Created', status:'ok', data: response })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    
    productsUpdateTituloDescripcion: async(req, res) => {
        let idProduct = String(req.body.idProduct)
        let dataProduct = req.body.dataProduct
        let data = {
            titulo: dataProduct.titulo,
            descripcion: dataProduct.descripcion,
            updatedAt: Date.now(),
            etiquetas: dataProduct.etiquetas
        }

        try {
            let response = await mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, data)
            res.json({ message:'Product updated', status:'ok', data: response })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    
    updateCostosYganancias: async(req, res) => {
        let idProduct = String(req.body.data.idProduct)
        let dataProduct = req.body.data
        let data = {
            updatedAt: Date.now(),
            costo: dataProduct.costo,
            ganancias: dataProduct.ganancias,
            proveedor: dataProduct.proveedor
        }

        try {
            let response = await mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, data)
            res.json({ message:'Product updated', status:'ok', data: response })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }

    },
 
    updateUnidadDeMedida: async(req, res) => {
        let idProduct = String(req.body.idProduct)
        let dataProduct = req.body
        let data = {
            updatedAt: Date.now(),
            unidadDeMedida: dataProduct.unidadDeMedida
        }

        try {
            let response = await mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, data)
            res.json({ message:'Product updated', status:'ok', data: response })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }

    },
    
    updateStock: async(req, res) => {
        let idProduct = String(req.body.idProduct)
        let dataStock = req.body.dataStock
        let data = {
            updatedAt: Date.now(),
            stock: dataStock
        }

        try {
            let response = await mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, data)
            res.json({ message:'Product updated', status:'ok', data: response })
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error, body:req.body })
        }

    },
    
    productsDelete: async(req, res) => {
        let idProduct = String(req.body.idProduct)

        let pendientes = []
        let errores = ''
        // antes eliminar las imagenes!
        try {
            let product = await mongoDb.findDocuments('products', {_id: new ObjectId(idProduct)})
            if (product.length >= 1) {  product = product[0] }

            await product.imagenes.forEach( async imagen => {
                await imagekit.deleteFile(imagen.fileId)
                .then( async response => {
                    // console.log(response);
                })
                .catch(error => {
                    pendientes.push(imagen)
                    errores += error.message + '  '
                    console.log(error);
                });
            });

            if (pendientes.length == 0) {
                let response = await mongoDb.deleteDocuments('products', {_id: new ObjectId(idProduct)})
                res.json({ message:'Product deleted', status:'ok', data: response })
                
            } else {
                let data = {
                    updatedAt: Date.now(),
                    imagenes: pendientes
                }
                let response = await mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, data)

                res.json({ message:'Error al eliminar las imagenes: '+errores, status:'error', data: errores, pendientes, response })
            }
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    
    setImagenPrincipal: async(req, res) => {
        let idProduct = String(req.body.idProduct)
        let fileId = String(req.body.fileId)

        try {
            let product = await mongoDb.findDocuments('products', {_id: new ObjectId(idProduct)})
            if (product.length > 0) {
                product = product[0]
                product.imagenes.sort((a, b) => {
                    if (a.fileId == fileId) {
                      return -1;
                    }
                    if (a.fileId != fileId) {
                      return 1;
                    }
                  });
            let data = {
            updatedAt: Date.now(),
            imagenes: product.imagenes
            }
            let response = await mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, data)

                  res.json({ message:'Product Edited', status:'ok', data: product })
            } else {
                res.json({ message:'Product not fonuded', status:'error', data: product })
            }
        } catch (error) {
            res.json({ message:'Error: '+error.message, status:'error', data: error })
        }

    },
    

}
