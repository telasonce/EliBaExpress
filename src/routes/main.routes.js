const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')


router.get('/', mainController.index);
// router.get('/login', mainController.index);
// router.get('/cerrarSesion', mainController.index);
router.get('/perfil', permisosMiddleware, mainController.perfil);
// router.get('/contacto', mainController.index);

module.exports = router; 