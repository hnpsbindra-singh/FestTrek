package com.testing.springpractice.festmanagement.Service;

import com.testing.springpractice.festmanagement.DTO.OrganiserPaymentDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void SendWelcome(String toMail, String name){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toMail);
        mailMessage.setFrom(fromEmail);
        mailMessage.setSubject("Welcome " + name + "!");
        mailMessage.setText(
                "Hi " + name + ",\n\n" +

                        "🎟️ Welcome to FestTrek!\n\n" +

                        "Your account has been successfully created and you're now ready to explore and book amazing events.\n\n" +

                        "From concerts and workshops to hackathons, tech events, and cultural festivals ⚡🎶, FestPass helps you discover experiences and reserve your spot effortlessly.\n\n" +

                        "Here’s what you can now do:\n" +
                        "• Browse upcoming events\n" +
                        "• Book tickets instantly\n" +
                        "• Access your secure booking passes\n" +
                        "• Track your bookings and event details\n" +
                        "• Enjoy a smoother event experience\n\n" +

                        "We’re excited to make event booking faster, simpler, and hassle-free for you.\n\n" +

                        "See you at the next event 🎉\n\n" +

                        "— Team FestTrek"
        );

        mailSender.send(mailMessage);
    }

    public void sendotp(String username, String otp) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setTo(username);

        mailMessage.setFrom(fromEmail);

        mailMessage.setSubject("FestTrek OTP");

        mailMessage.setText(
                "Your FestTrek verification OTP is: " + otp +

                        "\n\nThis OTP is valid for 5 minutes." +

                        "\n\nIf you did not request this OTP, please ignore this email." +

                        "\n\n— Team FestTrek"
        );

        mailSender.send(mailMessage);
    }

    public void sendConfirmationMail(String bookingKey, String receiverEmail) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(receiverEmail);
        message.setSubject("Fest Booking Confirmed 🎉");

        message.setText(
                "Your booking has been successfully verified.\n\n"
                        + "Booking Key: " + bookingKey + "\n\n"
                        + "Please keep this key safe for entry verification.\n\n"
                        + "Thank you for registering!"
        );

        mailSender.send(message);
    }

    public void sendPaymentDetails(

            String toMail,

            String festTitle,

            Long slots,

            Long totalAmount,

            OrganiserPaymentDetails details
    ) {

        SimpleMailMessage mail =
                new SimpleMailMessage();

        mail.setTo(toMail);

        mail.setFrom(fromEmail);

        mail.setSubject(
                "FestTrek Payment Instructions"
        );

        mail.setText(

                "🎟️ Your booking request has been created successfully.\n\n" +

                        "Event: " + festTitle + "\n" +

                        "Slots Booked: " + slots + "\n" +

                        "Total Amount: ₹" +
                        totalAmount + "\n\n" +

                        "Please complete your payment using the following details:\n\n" +

                        "💳 UPI ID: " +
                        details.getUpiId() + "\n\n" +

                        "🏦 Account Holder: " +
                        details.getAccountHolderName() + "\n" +

                        "🏦 Account Number: " +
                        details.getBankAccountNumber() + "\n" +

                        "🏦 IFSC Code: " +
                        details.getIfscCode() + "\n\n" +

                        "After completing payment, " +

                        "please click on 'I Have Paid' " +

                        "inside the app to submit your payment request for verification.\n\n" +

                        "Your booking will be confirmed once the organiser verifies your payment.\n\n" +

                        "— Team FestTrek"
        );

        mailSender.send(mail);
    }
}
