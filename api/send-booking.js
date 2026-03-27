import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const {
    name,
    email,
    phone,
    datetime,
    people,
    eventType,
    guestCount,
    address,
    message
  } = req.body;

  try {
    // EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // EMAIL CONTENT
    await transporter.sendMail({
      from: `"La Thorpe Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Table Booking - La Thorpe",
      html: `
        <h2>New Booking Request</h2>

        <b>Name:</b> ${name}<br>
        <b>Email:</b> ${email}<br>
        <b>Phone:</b> ${phone}<br>
        <b>Date & Time:</b> ${datetime}<br>
        <b>People:</b> ${people}<br><br>

        <h3>Catering Details</h3>
        <b>Event Type:</b> ${eventType}<br>
        <b>Guests:</b> ${guestCount}<br>
        <b>Address:</b> ${address}<br><br>

        <b>Message:</b><br>
        ${message}
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}