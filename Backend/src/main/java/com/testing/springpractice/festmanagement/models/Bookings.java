package com.testing.springpractice.festmanagement.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bookings {
    @Id
    private String id;
    @Indexed
    private String festId;
    @Indexed
    private String userId;
    private Long slots;
    private Long totalCost;
    private LocalDateTime bookingDatetime;
    private PaymentStatus paymentStatus;

    @Indexed(unique = true)
    private String bookingKey;

    public boolean checkedIn;

}
