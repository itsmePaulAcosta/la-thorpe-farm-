const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-booking", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            datetime,
            formattedDatetime,
            people,
            eventType,
            guestCount,
            address,
            message,
            catering
        } = req.body;

        // ✅ USE SAFE VALUE (NO Date conversion needed)
        const bookingTime = formattedDatetime || datetime;

        if (!name || !email || !phone || !datetime) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "lathorpecateringservices@gmail.com",
            subject: "New Booking Reservation",
            html: `
                <h2>New Booking Details</h2>

                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>

                <p><b>Date & Time (Philippines Time):</b> ${bookingTime}</p>

                <p><b>Number of People:</b> ${people}</p>

                <p><b>Catering:</b> ${catering ? "Yes" : "No"}</p>

                ${eventType ? `<p><b>Event Type:</b> ${eventType}</p>` : ""}
                ${guestCount ? `<p><b>Guest Count:</b> ${guestCount}</p>` : ""}
                ${address ? `<p><b>Address:</b> ${address}</p>` : ""}
                ${message ? `<p><b>Message:</b> ${message}</p>` : ""}
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "Booking sent successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;
