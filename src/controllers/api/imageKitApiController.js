
const mongoDb = require('../../database/configMongoDb')
const imagekit = require('../../functions/imageKit')
const ObjectId = require('mongodb').ObjectId;

async function resultdbTest() {
    // console.log( await ( mongoDb.insertDocuments('users',[{hello:'banana'},{hellowin:'frita',lopez:'gomez'}] ) ) )
    // console.log( await mongoDb.updateDocuments('users',{hello:'banana'},{hellowin:'frita'}) )
    // console.log( await ( mongoDb.deleteDocuments('users',{_id: new ObjectId("65b98c20c1542a001268e78e")}) ) )
    let res = await mongoDb.findDocuments('products',{titulo:'titulo 6 arreglado'})
    console.log( res ) 
    
    console.log( await mongoDb.finalizarConexion() )
}
// resultdbTest()

module.exports = {
    upload: async(req, res) => {
      
        let imagen = req.body.imagen
        let idProduct = String(req.body.idProduct)

        imagekit.upload({
            file : imagen, //required
            fileName : Date.now()+ ".jpg", //required
            fileType:'image' ,
            // folder : "/products", //optional
            // tags : ["a ver este tagggg","tag2"], //optional
        })
        .then( async response => {
            // console.log(response);
            let url = response.thumbnailUrl
            let fileId = response.fileId
            try {
                let resultDb = await mongoDb.updateDocumentsLibre('products',{_id: new ObjectId(idProduct)},{ $push: { imagenes: {url,fileId} } })
                res.json({
                    message:'Imagen Subida Correctamente', status:'ok', url, fileId, resultDb, data: response.thumbnailUrl, response
                })
            } catch (error) {
                res.json({
                    message:'Ocurrio un error', status:'error', data: response.thumbnailUrl, response
                })
                
            }
        })
        .catch(error => {
            console.log(error);
            res.json({error:error})
        });

    },
    
    delete: async(req, res) => {
      
        let imageId = req.body.imageId 
        let idProduct = String(req.body.idProduct )
        // console.log(imageId, idProduct);
        imagekit.deleteFile(imageId)
            .then( async response => {
                // console.log(response);
                let resultDb1 = await mongoDb.findDocuments('products',{_id: new ObjectId(idProduct)})

                let newArrayImagenes = resultDb1[0].imagenes.filter(img => {
                    return img.fileId != imageId
                })

                let resultDb = await mongoDb.updateDocuments('products',{_id: new ObjectId(idProduct)},{ imagenes: newArrayImagenes })

                res.json({ message:'Imagen Eliminada', status:'ok', data:'', response, resultDb, resultDb1 })

            })
            .catch(error => {
                // console.log(error);
                res.json({error:error,message:'No se elimino la imagen: '+error.message, body:req.body})
            });
    },

}
