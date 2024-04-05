// mercadoPagoApiController
require('dotenv').config();

const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: process.env.AccessToken_MercadoPago });
const preference = new Preference(client);
const payment = new Payment(client);


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
            "notification_url": "https://www.your-site.com/ipn",
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


        res.json({
            resDB,
            status:200
        })
    },
    testWebhooks: async(req, res) => {
        let resDB = await mongoDb.findDocuments('testWebhooks')
        res.json({
            status:200,
            resDB
        })
    },

}





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

