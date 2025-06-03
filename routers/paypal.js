const express = require("express");
const got = require("got");
const router = express.Router();

const getAccessToken = async () => {
    try {
        const response = await got.post(
            `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`, {
                form: {
                    grant_type: "client_credentials",
                },
                headers: {
                    Authorization: "Basic " + Buffer.from(
                        `${process.env.PAYPAL_CLIENTID}:${process.env.PAYPAL_SECRET}`
                    ).toString("base64"),
                },
                responseType: "json",
            }
        );
        return response.body.access_token;
    } catch (err) {
        // Log dettagliato per capire l'errore
        if (err.response) {
            console.error("PayPal token error:", err.response.body);
        } else {
            console.error("PayPal token error:", err.message);
        }
        throw err;
    }
};

const createOrder = async (req, res) => {
    try {
        const accessToken = await getAccessToken();

        const response = await got.post(
            `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                json: {
                    intent: "CAPTURE",
                    purchase_units: [{
                        items: [{
                            name: "boa costrictor",
                            description: "serpentone",
                            quantity: "1",
                            unit_amount: {
                                currency_code: "USD",
                                value: "100.00",
                            },
                        }],
                        amount: {
                            currency_code: "USD",
                            value: "100.00",
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: "100.00",
                                },
                            },
                        },
                    }],
                    payment_source: {
                        paypal: {
                            experience_context: {
                                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                                payment_method_selected: "PAYPAL",
                                brand_name: "Sergente Serpente",
                                shipping_preference: "NO_SHIPPING",
                                locale: "en-US",
                                user_action: "PAY_NOW",
                                return_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/complete-payment`,
                                cancel_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/cancel-payment`,
                            },
                        },
                    },
                },
                responseType: "json",
            }
        );

        console.log(response.body);

        const orderId = response.body && response.body.id;

        return res.status(200).json({
            orderId
        });
    } catch (err) {
        // Log dettagliato per capire l'errore
        if (err.response) {
            console.error("PayPal createOrder error:", err.response.body);
            return res.status(500).json({
                error: err.response.body
            });
        } else {
            console.error("PayPal createOrder error:", err.message);
            return res.status(500).json({
                error: err.message
            });
        }
    }
};

const captureOrder = async (req, res) => {
    try {
        const {
            orderId
        } = req.body;
        const accessToken = await getAccessToken();

        const response = await got.post(
            `${process.env.PAYPAL_BASEURL}/v2/checkout/orders/${orderId}/capture`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "json",
            }
        );

        if (response.body.status === "COMPLETED") {
            return res.status(200).json({
                status: "COMPLETED"
            });
        } else {
            return res.status(400).json({
                status: response.body.status
            });
        }
    } catch (err) {
        // Log dettagliato per capire l'errore
        if (err.response) {
            console.error("PayPal captureOrder error:", err.response.body);
            return res.status(500).json({
                error: err.response.body
            });
        } else {
            console.error("PayPal captureOrder error:", err.message);
            return res.status(500).json({
                error: err.message
            });
        }
    }
};

router.post("/createorder", (req, res, next) => {
    console.log("Richiesta ricevuta su /paypal/createorder");
    createOrder(req, res).catch(next);
});
router.post("/captureorder", (req, res, next) => {
    console.log("Richiesta ricevuta su /paypal/captureorder");
    captureOrder(req, res).catch(next);
});

module.exports = router;
























// const express = require("express");
// const got = require("got");
// require("dotenv").config();

// const router = express.Router();

// // Funzione per ottenere il token di accesso da PayPal
// const getAccessToken = async () => {
//     try {
//         const response = await got.post(
//             `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`, {
//                 form: {
//                     grant_type: "client_credentials",
//                 },
//                 headers: {
//                     Authorization: "Basic " + Buffer.from(
//                         `${process.env.PAYPAL_CLIENTID}:${process.env.PAYPAL_SECRET}`
//                     ).toString("base64"),
//                 },
//                 responseType: "json", // Con got@10 puoi ottenere giÃ  l'oggetto JSON
//             }
//         );

//         console.log("PayPal Access Token Data:", response.body);
//         return response.body.access_token;
//     } catch (err) {
//         console.error("Errore durante l'ottenimento del token di accesso PayPal:");
//         if (err.response) {
//             console.error("Status:", err.response.statusCode);
//             console.error("Headers:", err.response.headers);
//             console.error("Body:", err.response.body);
//         } else {
//             console.error("Errore di rete o altro:", err.message);
//         }
//         throw new Error("Impossibile ottenere il token di accesso PayPal.");
//     }
// };

// // Endpoint per creare un ordine PayPal (placeholder per ora)
// const createOrder = async (req, res) => {
//     try {
//         const accessToken = await getAccessToken();
//         return res.status(200).json({
//             message: "Order created successfully",
//             // accessToken, // NON includere mai questo in risposta in produzione!
//         });
//     } catch (err) {
//         console.error("Errore nella creazione dell'ordine:", err.message);
//         res.status(500).json({
//             error: "Errore interno del server durante la creazione dell'ordine.",
//         });
//     }
// };

// router.post("/createorder", createOrder);

// module.exports = router;