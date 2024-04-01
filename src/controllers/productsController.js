
const mongoDb = require('../database/configMongoDb')
const imagekit = require('../functions/imageKit')
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
    indexProducts: async(req, res) => {
        let products = await mongoDb.findDocuments('products', {isActive:true})
        res.render('products/indexProducts', { user:req.session.userLogged , products})
    },

    adminProducts: async(req, res) => {
        res.render('products/adminProducts', { user:req.session.userLogged })
    },
   
    adminStockProducts: async(req, res) => {
        res.render('products/adminStock', { user: req.session.userLogged })
    },

    detailProduct: async(req, res) => {
        let idProduct = String(req.params.idProduct)
        let product = null

        if(idProduct.length != 24 ){
            res.render('products/detailProduct', { user:req.session.userLogged , product:null})
            return
        }

         try {
            product = await mongoDb.findDocuments('products', {_id: new ObjectId(idProduct)})
            // console.log(product)
        } catch (error) {
            console.log(error)
        }
        if (product.length > 0) {  product = product[0] }
        if(!product.vistas){product.vistas = 0}
        mongoDb.updateDocuments('products', {_id: new ObjectId(idProduct)}, {vistas:product.vistas+1})

        let urlActual = req.originalUrl
        // console.log(urlActual)
        res.render('products/detailProduct', { user:req.session.userLogged , product, urlActual})
    },

    updateProduct: async(req, res) => {
        let idProduct = String(req.params.idProduct)
        let product = []
        try {
            product = await mongoDb.findDocuments('products', {_id: new ObjectId(idProduct)})
            // console.log(product)
        } catch (error) {
            console.log(error)
        }
        if (product.length > 0) {  product = product[0] }
        res.render('products/updateProduct', { user:req.session.userLogged , product})
    },


}
