package com.testing.springpractice.festmanagement.Controllers;

import com.testing.springpractice.festmanagement.DTO.BookingRequest;
import com.testing.springpractice.festmanagement.DTO.BookingResponse;
import com.testing.springpractice.festmanagement.DTO.FestDto;
import com.testing.springpractice.festmanagement.Service.UserService;
import com.testing.springpractice.festmanagement.models.Fest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService service;
    @GetMapping("/view-All-Events-nearby")
    public List<FestDto> viewAllEvents(@RequestParam double latitude,

                                       @RequestParam double longitude,

                                       @RequestParam double radiusKm){
        return service.viewAlleventsNearby(latitude,longitude,radiusKm);

    }

    @GetMapping("/view-event/{festId}")
    public FestDto ViewDetails(@PathVariable String festId){
        return service.viewEvent(festId);
    }
    @PostMapping("/Book-Ticket/{festId}")
    public BookingResponse Bookevent(@PathVariable String festId, @RequestParam String userId, @RequestBody BookingRequest request){
        return service.bookevent(festId, userId, request);
    }

    @PostMapping("/submit-payment/{bookingId}")
    public String submitPayment(

            @PathVariable String bookingId,

            @RequestParam String userId
    ) {

        System.out.println(bookingId);
        return service.submitPayment(
                bookingId,
                userId
        );
    }

    @GetMapping("/my-bookings")
    public List<BookingResponse> myBookings(

            @RequestParam String userId
    ) {

        return service.myBookings(
                userId
        );
    }

    @GetMapping("/ticket/{bookingId}")
    public BookingResponse viewTicket(

            @PathVariable String bookingId,

            @RequestParam String userId
    ) {

        return service.viewTicket(
                bookingId,
                userId
        );
    }







}
