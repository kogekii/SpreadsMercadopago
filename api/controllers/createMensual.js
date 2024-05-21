// const fetch = require('node-fetch');
const { MercadoPagoConfig, PreApproval } = require('mercadopago');
const dotenv = require('dotenv');
const moment = require('moment');

exports.createMensual = async (req, res) => {
    dotenv.config();
    const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
    const preApprovalPlan = new PreApproval(client);
    
    const initialDate = moment();
    const finalDate = moment().add(req.params.months, 'months');

    const result = await preApprovalPlan.create({
        body: {
            reason: 'Plan Mensual',
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                start_date: initialDate.toISOString(),
                end_date: finalDate.toISOString(),
                transaction_amount: 50000,
                currency_id: 'CLP'
            },
            back_url: `${process.env.BACK_URL}`,
            payer_email: `${req.params.email}`
        }
    })
    console.log(result.init_point);
    res.send(`${result.init_point}`)
};






