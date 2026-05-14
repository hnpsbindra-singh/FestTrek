package com.testing.springpractice.festmanagement.DTO;

import com.testing.springpractice.festmanagement.models.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private String id;
    private String festId;
    private String userId;
    private Long slots;
    private Long totalCost;
    private LocalDateTime bookingDatetime;
    private PaymentStatus paymentStatus;
    private String bookingKey;
}
