
const mongoDb = require('../database/configMongoDb')
const imagekit = require('../functions/imageKit')
const sendEmail = require('../functions/sendEmail')

async function resultdbTest() {
    // console.log( await ( mongoDb.insertDocuments('users',[{nombre:'david', apellido:'chami'},{nombre:'jose',apellido:'chami'}] ) ) )
    console.log( await mongoDb.updateDocuments('users',{nombre:'david'}, {nombre:'Moshe David'}) )
    // console.log( await ( mongoDb.deleteDocuments('users',{_id: new ObjectId("65b98c20c1542a001268e78e")}) ) )
    console.log( await mongoDb.findDocuments('users') )
    console.log( await mongoDb.finalizarConexion() )
}
// resultdbTest()


module.exports = {
    index: async(req, res) => {
        let message = req.cookies.message
        res.clearCookie('message');

        
        res.render('main/index', { message, user:req.session.userLogged })
    },

    perfil: async(req, res) => {
        // let email = await sendEmail('moshechami@gmail.com','probando el asunto', `<h1>Este es un buen h1 a ver si funca!!</h1>${Date.now()}`)
        // console.log(email)

        res.json({
            data:'perfil', message: 'este es el mensaje'
        })
        // res.render('main/index', { message: 'q tal??' })
    },

}
