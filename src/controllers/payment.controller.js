
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { google } from 'googleapis';
import dotenv from 'dotenv';
export const createOrder = async (req, res) => {
    dotenv.config();
    
    const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
    const preference = new Preference(client);

    const result = await preference.create({
        body: {
            items: [
                {
                    title: 'Test',
                    quantity: 1,
                    currency_id: 'CLP',
                    unit_price: 1.0
                }
            ],
            notification_url: "https://413d-2803-c180-2000-2b58-99cb-9f87-b99a-3293.ngrok-free.app/webhook",
        }
    });
    console.log(result);
    res.send('Creating order')
};

async function appendData(auth, values) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1BIhIl56LRCID8D3fcDcncmoE9UgoQXQEA9qhrJnqSRg'; // Reemplaza esto con el ID de tu hoja de cálculo
    const range = 'Hoja 1!A:F';  // Asume que quieres añadir datos en las columnas A a C
    const valueInputOption = 'USER_ENTERED';

    const request = {
        spreadsheetId,
        range,
        valueInputOption,
        resource: {
            values
        }
    };

    try {
        const response = (await sheets.spreadsheets.values.append(request)).data;
        console.log('Datos añadidos:', response);
    } catch (err) {
        console.error('Error al añadir datos:', err);
    }
}


export const webhook = async (req, res) => {
    const paymentId = req.query['data.id'];

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
                [data.order.id, data.payer.email, data.description, data.transaction_details.total_paid_amount ,data.currency_id, data.date_approved]
            ];
            const KEYFILEPATH = 'src/mercadopagosheets-f761c5f10cbc.json';
            const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

            const auth = new google.auth.GoogleAuth({
                keyFile: KEYFILEPATH,
                scopes: SCOPES
            });

            

            appendData(auth, infopay);

        }
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}