const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');
const pedidosApiController = require('../controllers/api/pedidosApiController');

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')

const mercadoPagoApiController = require('../controllers/api/mercadoPagoApiController')


router.get('/carrito', pedidosController.carrito);
router.get('/misPedidos', mercadoPagoApiController.abrirNotificacionesMp, pedidosController.misPedidos);
router.get('/detalle/:idPedido', mercadoPagoApiController.abrirNotificacionesMp, pedidosController.detallePedido);
router.get('/admin', permisosMiddleware, mercadoPagoApiController.abrirNotificacionesMp, pedidosController.adminPedidos);

// Api pedidos
router.post('/api/verificarCarrito', pedidosApiController.verificarCarrito);
router.post('/api/realizarPedido', pedidosApiController.realizarPedido);
// router.post('/api/actualizar/', pedidosApiController.carrito);
router.post('/api/actualizar/cancelar', pedidosApiController.cancelarPedido);
router.post('/api/actualizar/guardarComentario', pedidosApiController.guardarComentario);
router.post('/api/actualizar/datosDeEnvio', pedidosApiController.guardarDatosDeEnvio);
// router.post('/api/eliminarPedido', pedidosApiController.carrito);

// router.get('/admin/update/:idProduct/', permisosMiddleware, productsController.updateProduct);

module.exports = router; 