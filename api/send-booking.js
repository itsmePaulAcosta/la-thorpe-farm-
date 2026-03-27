const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    // Allow only POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Only POST allowed"
        });
    }

    try {
        console.log("BODY RECEIVED:", req.body);

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

        // Validation
        if (!name || !email || !phone || !datetime || !people) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // ✅ FIX: Proper Date handling (NO manual split)
        const bookingDate = new Date(datetime);

        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid datetime value"
            });
        }

        // ✅ Format to Philippines Time (12-hour AM/PM)
        const bookingTimePH = new Intl.DateTimeFormat("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(bookingDate);

        // Create transporter
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
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color:#8B5E3C;">New Booking Details</h2>

                    <p><b>Name:</b> ${name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Phone:</b> ${phone}</p>

                    <p><b>Date & Time (Philippines Time):</b> ${bookingTimePH}</p>

                    <p><b>People:</b> ${people}</p>
                    <p><b>Catering:</b> ${catering ? "YES" : "NO"}</p>

                    <hr>

                    <h3 style="color:#8B5E3C;">Catering Info</h3>
                    <p><b>Event Type:</b> ${eventType || "N/A"}</p>
                    <p><b>Guests:</b> ${guestCount || "N/A"}</p>
                    <p><b>Address:</b> ${address || "N/A"}</p>

                    <hr>

                    <h3 style="color:#8B5E3C;">Message</h3>
                    <p>${message || "N/A"}</p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Booking email sent successfully"
        });

    } catch (error) {
        console.error("EMAIL ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
