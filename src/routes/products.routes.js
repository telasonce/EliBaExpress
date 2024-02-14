const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')


router.get('/', productsController.indexProducts);
router.get('/detail/:idProduct/', productsController.detailProduct);
router.get('/admin/update/:idProduct/', permisosMiddleware, productsController.updateProduct);

router.get('/admin', permisosMiddleware, productsController.adminProducts);

module.exports = router; 