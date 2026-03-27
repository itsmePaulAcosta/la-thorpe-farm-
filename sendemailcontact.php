<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // SERVER SETTINGS
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'jhonpaula846@gmail.com';
    $mail->Password   = 'lxhgxsyuozzjpgcj'; // REMOVE SPACES
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // FIX for localhost (important)
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ];

    // SENDER
    $mail->setFrom('jhonpaula846@gmail.com', 'La Thorpe Booking');
    $mail->addReplyTo($_POST['email'], $_POST['name']);

    // RECEIVER
    $mail->addAddress('jhonpaula846@gmail.com');

    // CONTENT
    $mail->isHTML(true);
    $mail->Subject = 'New Table Booking - La Thorpe';

    $mail->Body = "
        <h2>New Booking Request</h2>
        <b>Name:</b> {$_POST['name']} <br>
        <b>Email:</b> {$_POST['email']} <br>
        <b>Phone:</b> {$_POST['phone']} <br>
        <b>Date & Time:</b> {$_POST['datetime']} <br>
        <b>People:</b> {$_POST['people']} <br><br>

        <h3>Catering Details</h3>
        <b>Event Type:</b> {$_POST['eventType']} <br>
        <b>Guests:</b> {$_POST['guestCount']} <br>
        <b>Address:</b> {$_POST['address']} <br><br>

        <b>Message:</b><br>
        {$_POST['message']}
    ";

    $mail->send();

    // ✅ SUCCESS MESSAGE
    echo "<script>
        alert('✅ Booking sent successfully! We will contact you soon.');
        window.location.href='booking.html';
    </script>";

} catch (Exception $e) {

    // ❌ CLEAN ERROR MESSAGE FOR USER
    echo "<script>
        alert('❌ Booking failed. Please try again later or check your internet.');
        window.history.back();
    </script>";

    // 👇 FOR DEBUG (you can remove later)
    echo "<pre>Error Details: {$mail->ErrorInfo}</pre>";
}
?>