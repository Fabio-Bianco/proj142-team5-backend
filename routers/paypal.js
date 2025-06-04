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

        const { total } = req.body;

        if (!total) {
            return res.status(400).json({ error: "Total amount is required." });
        }

        const response = await got.post(
            `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                json: {
                    intent: "CAPTURE",
                    purchase_units: [{

                        amount: {
                            currency_code: "USD",
                            value: total,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: total,
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
            console.error("PayPal createOrder error response body:", err.response.body);
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
























