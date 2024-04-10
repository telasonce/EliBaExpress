
const mongoDb = require('../database/configMongoDb')
const imagekit = require('../functions/imageKit')
const sendEmail = require('../functions/sendEmail')
const ObjectId = require('mongodb').ObjectId;


async function resultdbTest() {
    // console.log( await ( mongoDb.insertDocuments('users',[{nombre:'david', apellido:'chami'},{nombre:'jose',apellido:'chami'}] ) ) )
    // console.log( await mongoDb.updateDocuments('users',{nombre:'david'}, {nombre:'Moshe David'}) )
    // console.log( await ( mongoDb.deleteDocuments('colores',{_id: new ObjectId("66171bfb4e237dc59bd7bac9")}) ) )
    console.log( await mongoDb.findDocuments('users') )
    console.log( await mongoDb.finalizarConexion() )
}
// resultdbTest()


module.exports = {
    index: async(req, res) => {
        let message = req.cookies.message
        res.clearCookie('message');

        let querySearch = req.query.q || ''
        
        res.render('main/index', { message, user:req.session.userLogged, querySearch })
    },

    administrarUsuarios: async(req, res) => {
        let users = await mongoDb.findDocuments('users')

        res.render('users/administrarUsuarios', {users, user:req.session.userLogged })
    },

    perfil: async(req, res) => {
        if (req.session.userLogged) {
            res.render('users/perfil', { user:req.session.userLogged})
        } else {
            res.cookie('message' , 'Por favor Inicia Sesión', {expire : 30 * 1000 }); // 30 segs
            res.redirect('/')
        }
    },

    resumenBusquedas: async(req, res) => {
        let busquedas = await mongoDb.findDocuments('busquedas')

        res.render('admin/busquedas', { busquedas, user:req.session.userLogged})
    },

    

}
