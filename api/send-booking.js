const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Only POST allowed"
        });
    }

    try {

        // 👇 PUT DEBUG HERE
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

        const {
            name,
            email,
            phone,
            datetime,
            people,
            eventType,
            guestCount,
            address,
            message,
            catering
        } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: "New Booking",
            html: `<p>${name}</p>`
        });

        return res.status(200).json({
            success: true,
            message: "Email sent"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
