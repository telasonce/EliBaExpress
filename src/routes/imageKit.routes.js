const express = require('express');
const router = express.Router();

const imageKitController = require('../controllers/api/imageKitApiController');

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')

router.post('/upload', imageKitController.upload);
router.post('/delete', imageKitController.delete);
// router.get('/login', mainController.index);
// router.get('/cerrarSesion', mainController.index);
// router.get('/perfil', permisosMiddleware, mainController.perfil);
// router.get('/contacto', mainController.index);

module.exports = router; 