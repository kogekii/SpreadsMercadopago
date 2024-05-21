const dotenv = require('dotenv');
const { MercadoPagoConfig, Preference} = require('mercadopago');

exports.createAnual = async (req, res) => {
    dotenv.config();

    const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
    const preference = new Preference(client);

    const result = await preference.create({
        body: {
            items: [
                {
                    title: 'Plan Anual',
                    quantity: 1,
                    currency_id: 'CLP',
                    unit_price: 210000
                }
            ],
            back_urls: {
                success: `${process.env.BACK_URL}` || 'https://www.mercadopago.cl/',
                failure: `${process.env.BACK_URL}` || 'https://www.mercadopago.cl/',
                pending: `${process.env.BACK_URL}` || 'https://www.mercadopago.cl/'
            },
            notification_url: `${process.env.NOTIFICATION_URL}`,
        }
    });
    console.log(result.init_point);
    res.send(`${result.init_point}`)
};