// mercadoPagoApiController
require('dotenv').config();

const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios')
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: process.env.AccessToken_MercadoPago });
const preference = new Preference(client);
const payment = new Payment(client);

async function postMPgetpayments(id = 1) {
    try { const response = await axios.get('https://api.mercadopago.com/v1/payments/' + Number(id), {
            headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } });
            return response.data
    } catch (error) { return error }
}

async function postMPgetmerchant_orders(id = 1) {
    try { const response = await axios.get('https://api.mercadopago.com/merchant_orders/' + Number(id), {
            headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } });
            console.log(response.data)
            return response.data
    } catch (error) { return error }
}

async function postMPgetBuscarPreferences(external_reference ='') {
    try { const response = await axios.get('https://api.mercadopago.com/checkout/preferences/search?site_id=MLA&external_reference=' + (external_reference), {
            headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } });
            console.log(response.data.elements.reverse())
            return response.data
    } catch (error) { 
        console.log(error)
        return error }
}

async function postMPgetObtenerPreferencia(id = '') {
    try { const response = await axios.get('https://api.mercadopago.com/checkout/preferences/' + (id), {
            headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } });
            console.log(response.data)
            return response.data
    } catch (error) { 
        console.log(error)
        return error }
}

async function postWebhookTest(id = 1, topic='merchant_order') {
    try { const response = await axios.post(`http://localhost:3000/api/webhooks?id=${id}&&topic=${topic}`, {
            // headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } 
        });
            console.log(response)
            return response 
    } catch (error) { 
        console.log(error)
        return error }
}


async function calculatePaidAmount(merchantOrder, notificacion) {
    let pagos = []
    let totalPagado = 0
    let msg = ''
    let estado = ''
    let statusPago = merchantOrder.order_status //payment_required o reverted o paid
    await merchantOrder.payments.forEach(payment => {
        pagos.push({
            id: payment.id,
            pago: payment.transaction_amount,
            fecha: payment.date_approved,
            status: payment.status
        })
        if (payment.status == 'approved') {
            totalPagado += payment.transaction_amount;
        }
    });
        if (totalPagado >= merchantOrder.total_amount ) {
            msg = 'Totalmente pagado'
            estado = 'Pago Completo'
        } else {
            msg = 'Aún no pagado'
            estado = 'Pago Incompleto'
        }

        let dataUpdatePedido = {
            updatedAt: Date.now(),
            statusPago,
            pagos,
            merchant_order_id: merchantOrder.id
        }
        let response1 = await mongoDb.updateDocuments('pedidos', {external_reference: Number(merchantOrder.external_reference)}, dataUpdatePedido)
        let resDBPedido = await mongoDb.findDocuments('pedidos', {external_reference: Number(merchantOrder.external_reference)})
        if (resDBPedido.length >= 1 && resDBPedido[0].estados[resDBPedido[0].estados.length -1].msg != estado) {
            console.log(resDBPedido[0].estados, resDBPedido[0].estados[resDBPedido[0].estados.length -1] , estado)
            let response2 = await mongoDb.updateDocumentsLibre('pedidos',{external_reference: Number(merchantOrder.external_reference)},{ $push: { estados: {date: Date.now(), msg: estado } } })
        }

        let response3 = await mongoDb.updateDocuments('notificacionesMp', {_id: new ObjectId(String(notificacion._id))}, {open:true})

        Promise.all([response1, resDBPedido, response3]).then(
            (values) => {
                console.log(values);
                return 'ok'
            },
            (reason) => {
              console.log(reason);
            },
          );
}

// let res = postWebhookTest('17411401521')
// console.log(  )
// postMPgetBuscarPreferences()
// postMPgetObtenerPreferencia('1321815010-033748f4-4290-4d25-88cf-557a8cdf8d27')
// postMPgetmerchant_orders(17411401521)

module.exports = {
    crearPreferenciaId: async(external_reference, totalPedido) => {
        let data = await preference.create({
          body: {
            payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [
                    {
                              id: "ticket"
                    }
          ],
          installments: 3
        },
            items: [
              {
                title: 'Pedido varios productos EliBaExpress',
                quantity: 1,
                unit_price: totalPedido
              }
            ],
            "back_urls": {
                "success": "http://localhost:3000/pedidos/detalle/0?externalReference="+external_reference,
                "failure": "http://localhost:3000/pedidos/detalle/0?externalReference="+external_reference,
                "pending": "http://localhost:3000/pedidos/detalle/0?externalReference="+external_reference
            },
            "notification_url": "https://elibaexpress.com.ar/api/webhooks", //source_news=ipn
            "statement_descriptor": "EliBaExpress",
            "external_reference": external_reference,
            "binary_mode": true,
            "auto_return": "approved",

          }
        })
        // console.log('dataMPMP')
        // console.log(data)
        return data
        // .then(data=>{

        //     console.log('dataMP')
        //     console.log(data)
        //     return data
        // })
        // .catch(console.log);
    
    },
    webhookIpn: async(req, res) => {
        let topic = req.query.topic //payment, chargebacks, merchant_order o point_integration_ipn.
        let queryId = req.query.id 

        if (topic && queryId) {
            let data = {
                queryId, topic, open: false
            }
            let resDb = await mongoDb.insertDocuments('notificacionesMp', [data])
            res.json({ status:200 , resDb})
            
        } else {
            res.json({ status:200 })
        }
        // data.num = 1
        //  await mongoDb.insertDocuments('testWebhooks', [data])
        //  await mongoDb.insertDocuments('testWebhooks', [data])
        // data.num = 2
        //  await mongoDb.insertDocuments('testWebhooks', [data])
        // data.num = 3
        //  await mongoDb.insertDocuments('testWebhooks', [data])

        // Arranca 
        let merchant_order = null;
        //  switch (req.query.topic) { // llega payment o merchant_order

        //     case "payment":
        //         await postMPgetpayments(Number(req.query.id)).then( async dataPayment => {
        //             await postMPgetmerchant_orders(Number(dataPayment.order.id)).then( async dataMerchant => {
        //                 merchant_order = dataMerchant
        //                  await calculatePaidAmount(merchant_order)
        //                 })
        //             })
        //         break;

        //     case "merchant_order":
        //         await postMPgetmerchant_orders(Number(req.query.id)).then( async data => {
        //             merchant_order = data
        //             await calculatePaidAmount(merchant_order)
        //             })
        //         break;

        //         default:
        //             res.json({ status:200 })
        //         break;
        // }

        async function calculatePaidAmount(merchantOrder) { //sin uso
            let pagos = []
            let totalPagado = 0
            let msg = ''
            let estado = ''
            let statusPago = merchantOrder.order_status //payment_required o reverted o paid o partially_reverted o partially_paid o payment_in_process o undefined o expired
            await merchantOrder.payments.forEach(payment => {
                pagos.push({
                    id: payment.id,
                    pago: payment.transaction_amount,
                    fecha: payment.date_approved,
                    status: payment.status
                })
                if (payment.status == 'approved') {
                    totalPagado += payment.transaction_amount;
                }
            });
                if (totalPagado >= merchantOrder.total_amount ) {
                    msg = 'Totalmente pagado'
                    estado = 'Pago Completo'
                } else {
                    msg = 'Aún no pagado'
                    estado = 'Pago Incompleto'
                }

                let dataUpdatePedido = {
                    updatedAt: Date.now(),
                    statusPago,
                    pagos,
                    merchant_order_id: merchantOrder.id
                }
                let response1 = await mongoDb.updateDocuments('pedidos', {external_reference: Number(merchantOrder.external_reference)}, dataUpdatePedido)
                let resultDb2 = await mongoDb.updateDocumentsLibre('pedidos',{external_reference: Number(merchantOrder.external_reference)},{ $push: { estados: {date: Date.now(), msg: estado } } })

                res.json({ status:200, response1, resultDb2 })
                // return 'ok'
        }


    },
    testWebhooks: async(req, res) => {
        // let resDB = await mongoDb.findDocuments('pedidos')
        let resDB = await mongoDb.findDocuments('notificacionesMp')
        res.json({
            status:200,
            count: resDB.length,
            resDB: resDB.reverse()
        })
    },

    abrirNotificacionesMp: async (req, res, next) =>{

        let notificacionesMp = await mongoDb.findDocuments('notificacionesMp')
        let respuesta = {
            notificacionesMp
        }
        for (let index = 0; index < notificacionesMp.length; index++) {
            const notificacion = notificacionesMp[index];
            
        
        // await notificacionesMp.forEach( async notificacion => {

            if ( !notificacion.open) {
                
                switch (notificacion.topic) { // llega payment o merchant_order
                    
                    case "payment":
                        await postMPgetpayments(Number(notificacion.queryId)).then( async dataPayment => {
                            await postMPgetmerchant_orders(Number(dataPayment.order.id)).then( async dataMerchant => {
                                // merchant_order = dataMerchant
                                await calculatePaidAmount(dataMerchant, notificacion)
                            })
                        })
                        break;
                        
                    case "merchant_order":
                        await postMPgetmerchant_orders(Number(notificacion.queryId)).then( async dataMerchant => {
                            // merchant_order = data
                            await calculatePaidAmount(dataMerchant, notificacion)
                        })
                        break;
                            
                }
            }

        // })
        }
        setTimeout(() => {
            next()
          }, 2000);
        
        // return respuesta

    }

}
// postMPgetpayments(75629374702).then(data => console.log( data ))
// postMPgetmerchant_orders(17350124118).then(data => console.log( data ))

 async function getPedidos() {
     let pedidos = await mongoDb.findDocuments('pedidos',{external_reference:1712343710269})
     console.log(pedidos) 
}
// getPedidos()



// const mercadopago = require('mercadopago');
// mercadopago.configure({
//   access_token: process.env.AccessToken_MercadoPago
// });
// var mercadopago = require('mercadopago');
// mercadopago.configurations.setAccessToken(process.env.AccessToken_MercadoPago);

// let url = 'https://momentjs.com/?topic=payment&&id=789'
// let merchantOrder = null;
// switch (new URLSearchParams(url).get('topic')) {
//   case 'payment':
//     payment.findById(new URLSearchParams(window.location.search).get('id'))
//       .then(payment => {
//         // Get the payment and the corresponding merchant_order reported by the IPN.
//         return mercadopago.merchantOrder.findById(payment.body.order.id);
//       })
//       .then(order => {
//         merchantOrder = order.body;
//       });
//     break;
//   case 'merchant_order':
//     mercadopago.merchantOrder.findById(new URLSearchParams(window.location.search).get('id'))
//       .then(order => {
//         merchantOrder = order.body;
//       });
//     break;
// }

// let paidAmount = 0;
// merchantOrder.payments.forEach(payment => {
//   if (payment.status === 'approved') {
//     paidAmount += payment.transaction_amount;
//   }
// });

// // If the payment's transaction amount is equal (or bigger) than the merchant_order's amount you can release your items
// if (paidAmount >= merchantOrder.total_amount) {
//   if (merchantOrder.shipments.length > 0) { // The merchant_order has shipments
//     if (merchantOrder.shipments[0].status === "ready_to_ship") {
//       console.log("Totally paid. Print the label and release your item.");
//     }
//   } else { // The merchant_order don't has any shipments
//     console.log("Totally paid. Release your item.");
//   }
// } else {
//   console.log("Not paid yet. Do not release your item.");
// }

// console.log(client)