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
    try { const response = await axios.get('https://api.mercadopago.com/v1/payments/' + id, {
            headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } });
            return response.data
    } catch (error) { return error }
}

async function postMPgetmerchant_orders(id = 1) {
    try { const response = await axios.get('https://api.mercadopago.com/merchant_orders/' + id, {
            headers: { 'Authorization': 'Bearer ' + process.env.AccessToken_MercadoPago } });
            return response.data
    } catch (error) { return error }
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
// let res = postWebhookTest(Number('17350124118'))
// console.log( res)

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
                "success": "https://www.success.com",
                "failure": "https://www.failure.com",
                "pending": "https://www.pending.com"
            },
            "notification_url": "https://elibaexpress.com.ar/api/webhooks?source_news=ipn",
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
        let paymentId = req.query.id 

        let data = {
            query: req.query,
            body: req.body,

        }
        let resDB = await mongoDb.insertDocuments('testWebhooks', [data])

        // Arranca
        let merchant_order = null;
        // let estados = []
         switch (req.query.topic) { // llega payment o merchantOrder

            case "payment":
                await postMPgetpayments(Number(req.query.id)).then( async dataPayment => {
                    await postMPgetmerchant_orders(dataPayment.order.id).then( async dataMerchant => {
                        merchant_order = dataMerchant
                         await calculatePaidAmount(merchant_order)
                        })
                    })
                break;

            case "merchant_order":
                await postMPgetmerchant_orders(Number(req.query.id)).then( async data => {
                    merchant_order = data
                    await calculatePaidAmount(merchant_order)
                    })
                break;

                default:
                    res.json({ status:200 })
                break;
        }

        async function calculatePaidAmount(merchantOrder) {
            let pagos = []
            let totalPagado = 0
            let msg = ''
            let estado = ''
            let statusPago = merchantOrder.order_status //payment_required o reverted o paid
            merchantOrder.payments.forEach(payment => {
                if (payment.status == 'approved') {
                    pagos.push({
                        id: payment.id,
                        pago: payment.transaction_amount,
                        fecha: payment.date_approved
                    })
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
                return {totalPagado, pagos, msg, estado, statusPago}
        }


    },
    testWebhooks: async(req, res) => {
        // let resDB = await mongoDb.findDocuments('pedidos')
        let resDB = await mongoDb.findDocuments('testWebhooks')
        res.json({
            status:200,
            count: resDB.length,
            resDB: resDB.reverse()
        })
    },

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