const express = require('express');
const router = express.Router();

const permisosMiddleware = require('../middlewares/permisosMiddleware.js')

const loginApiController = require('../controllers/api/loginApiController');
const productsApiController = require('../controllers/api/productsApiController');
const usersApiController = require('../controllers/api/usersApiController');
const coloresApiController = require('../controllers/api/coloresApiController.js');
const mercadoPagoApiController = require('../controllers/api/mercadoPagoApiController.js');
const busquedasApiController = require('../controllers/api/busquedasApiController.js');

// Api    registro, login y recuperar password
router.post('/apiLogin', loginApiController.apiLogin);
router.post('/apiRegistro', loginApiController.apiRegistro);
router.post('/apiRecuperarPassword', loginApiController.apiRecuperarPassword); // envia el email con el link
router.post('/apiUpdatePassword', loginApiController.apiUpdatePassword); //cambia la clave en la db
router.post('/apiGuardarNombreDispositivoVinculado', loginApiController.apiGuardarNombreDispositivoVinculado); //guarda nombre dispositivo
router.get('/cerrarSesion', loginApiController.cerrarSesion);

// asignar permisos a usuarios
router.post('/admin/bloquearUsuario', permisosMiddleware, usersApiController.bloquearUsuario); 
router.post('/admin/activarUsuario', permisosMiddleware, usersApiController.activarUsuario); 
router.post('/admin/asignarAdministradorUsuario', permisosMiddleware, usersApiController.asignarAdministradorUsuario); 
router.post('/admin/desasignarAdministradorUsuario', permisosMiddleware, usersApiController.desasignarAdministradorUsuario); 

// Api    products CRUD
router.get('/products/getAllProductsActive', productsApiController.getAllProductsActive);
router.get('/products/admin/getAllProducts', permisosMiddleware, productsApiController.getAllProductsAdmin);
router.get('/products/getById/:idProduct/', productsApiController.productsGetById);
router.post('/products/create', productsApiController.productsCreate);
router.post('/products/update', productsApiController.productsUpdateTituloDescripcion);
router.post('/products/admin/delete', permisosMiddleware, productsApiController.productsDelete);
router.post('/products/admin/reactivarProducto', permisosMiddleware, productsApiController.reactivarProducto);
router.post('/products/admin/pausarProducto', permisosMiddleware, productsApiController.pausarProducto);
router.post('/products/admin/update/costosYganancias', permisosMiddleware, productsApiController.updateCostosYganancias);
router.post('/products/admin/update/unidadDeMedida', permisosMiddleware, productsApiController.updateUnidadDeMedida);
router.post('/products/admin/update/stock', permisosMiddleware, productsApiController.updateStock);

//        set images imagekit  in product
router.post('/products/admin/update/setImagenPrincipal', permisosMiddleware, productsApiController.setImagenPrincipal);

// api crud colores
router.get('/colores/get', coloresApiController.getColores);
router.post('/colores/admin/save', permisosMiddleware, coloresApiController.insertColor);
router.post('/colores/admin/update', permisosMiddleware, coloresApiController.updateColor);
router.post('/colores/admin/delete', permisosMiddleware, coloresApiController.deleteColor);

// api mercado pago
router.post('/webhooks', mercadoPagoApiController.webhookIpn);
router.get('/testWebhooks', mercadoPagoApiController.testWebhooks);

// api guardar Query Busqueda
router.post('/guardarQueryBusqueda', busquedasApiController.guardarQueryBusqueda);
router.get('/getBusquedas', busquedasApiController.getBusquedas);



module.exports = router; 