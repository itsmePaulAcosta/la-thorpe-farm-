const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Only POST allowed"
        });
    }

    try {
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

        // Gmail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"La Thorpe Booking" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: "🍽 New Table Booking Received",
            html: `
                <h2>New Booking Details</h2>

                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Date & Time:</b> ${datetime}</p>
                <p><b>People:</b> ${people}</p>
                <p><b>Catering:</b> ${catering ? "YES" : "NO"}</p>

                <hr>

                <h3>Catering Info</h3>
                <p><b>Event Type:</b> ${eventType || "N/A"}</p>
                <p><b>Guests:</b> ${guestCount || "N/A"}</p>
                <p><b>Address:</b> ${address || "N/A"}</p>

                <hr>

                <h3>Message</h3>
                <p>${message || "N/A"}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Booking email sent successfully"
        });

    } catch (error) {
        console.error("Email Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
