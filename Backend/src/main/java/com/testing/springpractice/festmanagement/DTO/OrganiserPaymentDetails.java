package com.testing.springpractice.festmanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganiserPaymentDetails {
    private String upiId;

    private String bankAccountNumber;

    private String ifscCode;

    private String accountHolderName;

}
