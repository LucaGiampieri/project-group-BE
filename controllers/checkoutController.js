console.log("--- TEST ESTREMO ---")
//mi connetto al db
const connection = require("../data/db");
//import nodemailer per invio mail
const nodemailer = require('nodemailer');

// configuriamo il trasportatore per Mailtrap
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "5f702556730e37",
        pass: "49f04e642dcfe0"
    }
});

// funzione che gestisce il checkout
const processCheckout = (req, res) => {
    console.log("--- TEST ESTREMO: RICHIESTA RICEVUTA! ---");
    
    // 1. Verifichiamo cosa diamine sta arrivando davvero dal Frontend
    console.log("BODY INTEGRALE:", JSON.stringify(req.body, null, 2));

    const { shippingData, products, shipping_price, discount_percentage } = req.body;

    // 2. Controllo critico: products esiste? È un array?
    if (!products || !Array.isArray(products)) {
        console.log("❌ ERRORE CRITICO: 'products' non è un array!");
        console.log("Valore di products ricevuto:", products);
        return res.status(400).json({ success: false, message: "Il carrello è vuoto o corrotto." });
    }

    try {
        console.log("Inizio calcolo totale...");
        
        const cartTotal = products.reduce((sum, p) => {
            // Debug per ogni singolo prodotto
            console.log(`Calcolo prodotto: ${p.name}, Prezzo: ${p.price}, Qtà: ${p.quantity}`);
            
            const price = parseFloat(p.price) || 0;
            const qty = parseInt(p.quantity) || 0;
            return sum + (price * qty);
        }, 0);

        console.log("Totale parziale carrello:", cartTotal);

        const sPrice = parseFloat(shipping_price) || 0;
        const dPerc = parseFloat(discount_percentage) || 0;
        const discountAmount = cartTotal * (dPerc / 100);
        const totalFinal = cartTotal - discountAmount + sPrice;

        console.log("✅ TOTALE FINALE CALCOLATO:", totalFinal);

        // 3. Preparazione Mail
        const mailOptions = {
            from: '"Food Shop" <noreply@foodshop.com>',
            to: shippingData.email,
            subject: `Conferma ordine per ${shippingData.name}`,
            html: `<h1>Ordine confermato!</h1><p>Totale: ${totalFinal.toFixed(2)}€</p>`
        };

        console.log("Tentativo invio mail a:", shippingData.email);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("❌ ERRORE NODEMAILER:", error);
                return res.status(500).json({ success: false, error: "Errore mail" });
            }
            console.log("📧 MAIL INVIATA! ID:", info.messageId);
            
            res.status(200).json({
                success: true,
                order: {
                    id: Math.floor(Math.random() * 100000),
                    totalAmount: totalFinal.toFixed(2),
                    products: products
                }
            });
        });

    } catch (err) {
        console.log("❌ CRASH DURANTE L'ESECUZIONE:", err.message);
        res.status(500).json({ success: false, message: "Errore interno" });
    }
};

module.exports = { processCheckout };