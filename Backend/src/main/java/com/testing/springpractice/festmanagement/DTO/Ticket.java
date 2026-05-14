package com.testing.springpractice.festmanagement.DTO;

import com.testing.springpractice.festmanagement.models.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    private String festId;
    private String userId;
    private Long slots;
    private LocalDateTime bookingDatetime;
    private String bookingKey;

}
