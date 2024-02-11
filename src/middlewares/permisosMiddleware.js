

module.exports = async function (req, res, next) {

    if (false) {
        res.cookie('message' , 'No estas logueado, vaya a iniciar sesion', {expire : 30 * 1000 }); // 30 segs
        res.redirect('/')
    } else {
        next();
    }

}
