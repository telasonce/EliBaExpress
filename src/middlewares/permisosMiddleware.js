

module.exports = async function (req, res, next) {

    let autorizado = false
    let message = ''

    if (req.session.userLogged) {
        let user = req.session.userLogged

        if (req.url.includes('/admin')) {
            if(user.isAdmin){ autorizado = true } 
            else { message = 'Debes tener permisos de administrador' }
        }

    } else {
        message = 'No estas logueado, vaya a iniciar sesion'
    }

    if (autorizado) {
        next();
    } else {
        res.cookie('message' , message, {expire : 30 * 1000 }); // 30 segs
        res.redirect('/')
    }

}
