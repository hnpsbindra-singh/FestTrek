package com.testing.springpractice.festmanagement.Repo;

import com.testing.springpractice.festmanagement.models.Bookings;
import com.testing.springpractice.festmanagement.models.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingsRepo extends MongoRepository<Bookings, String> {
    List<Bookings> findByPaymentStatus(PaymentStatus paymentStatus);
    List<Bookings> findByFestIdAndPaymentStatus(String festId, PaymentStatus paymentStatus
    );

    Bookings findByBookingKey(String bookingKey);

    List<Bookings> findByUserId(String userId);
}
