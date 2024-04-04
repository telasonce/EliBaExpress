// mercadoPagoApiController
require('dotenv').config();

const mongoDb = require('../../database/configMongoDb')
const ObjectId = require('mongodb').ObjectId;

const { MercadoPagoConfig, Preference } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: process.env.AccessToken_MercadoPago });
const preference = new Preference(client);


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
    
    }
}





