const dotenv = require('dotenv');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

async function appendData(auth, values) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Hoja 1!A:F';
    const valueInputOption = 'USER_ENTERED';
    console.log("entro a appendData");
    const request = {
        spreadsheetId,
        range,
        valueInputOption,
        resource: {
            values
        }
    };

    try {
        console.log("entro a try");
        await sheets.spreadsheets.values.append(request);
        console.log('Datos añadidos');
    } catch (err) {
        console.log("entro a catch");
        console.error('Error al añadir datos:', err);
    }
}


exports.webhook = async (req, res) => {
    const auth = new GoogleAuth({
        credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const paymentId = req.query['data.id'];
    console.log(paymentId);

    switch (req.query['type']) {
        case 'subscription_authorized_payment':
            console.log(`es un plan con el id: ${paymentId}`);
            try {
                const factura = await fetch(`https://api.mercadopago.com/authorized_payments/${paymentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                });
                if (factura.ok) {
                    const data = await factura.json();
                    const preapprovalId = data.preapproval_id;
                    try {
                        const allApprovalPlans = await fetch(`https://api.mercadopago.com/preapproval/search?limit=1&sort=date_created:desc`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
                            }
                        });
                        if (allApprovalPlans.ok) {
                            const data = await allApprovalPlans.json();
                            console.log(data.results[0]);
                            console.log(preapprovalId);
                            console.log(data.results[0].id);
                            console.log(data.results[0].status);
                            if (data.results[0].status === 'authorized' && data.results[0].id === preapprovalId) {
                                const infopay = [
                                    [data.results[0].id, data.results[0].payer_first_name + data.results[0].payer_last_name, data.results[0].reason, data.results[0].auto_recurring.transaction_amount, data.results[0].auto_recurring.currency_id, data.results[0].last_modified]
                                ];
                                await appendData(auth, infopay);
                            }
                        }
                        res.sendStatus(200);
                    } catch (error) {
                        console.log(error);
                        res.sendStatus(500);
                    }

                }

            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
            break;
        case 'payment':
            try {
                const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.payer.email);
                    const infopay = [
                        [data.order.id, data.payer.email, data.description, data.transaction_details.total_paid_amount, data.currency_id, data.date_approved]
                    ];


                    await appendData(auth, infopay);

                }
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(500);
            }

    }

};