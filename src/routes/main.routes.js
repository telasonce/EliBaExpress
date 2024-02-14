const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')


router.get('/', mainController.index);
router.get('/admin/administrarUsuarios', permisosMiddleware, mainController.administrarUsuarios);
router.get('/perfil', mainController.perfil);
// router.get('/contacto', mainController.index);

module.exports = router; 