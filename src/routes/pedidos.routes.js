const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');
const pedidosApiController = require('../controllers/api/pedidosApiController');

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')


router.get('/carrito', pedidosController.carrito);
// router.get('/misPedidos', pedidosController.carrito);
// router.get('/detalle/:id', pedidosController.carrito);
// router.get('/admin', permisosMiddleware, pedidosController.carrito);

// Api pedidos
router.post('/api/verificarCarrito', pedidosApiController.verificarCarrito);
// router.post('/realizarPedido', pedidosController.carrito);
// router.post('/actualizarPedido', pedidosController.carrito);
// router.post('/eliminarPedido', pedidosController.carrito);

// router.get('/admin/update/:idProduct/', permisosMiddleware, productsController.updateProduct);

module.exports = router; 