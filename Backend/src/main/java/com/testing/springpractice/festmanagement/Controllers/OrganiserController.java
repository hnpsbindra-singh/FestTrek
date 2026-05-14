package com.testing.springpractice.festmanagement.Controllers;

import com.testing.springpractice.festmanagement.DTO.BookingResponse;
import com.testing.springpractice.festmanagement.DTO.FestDto;
import com.testing.springpractice.festmanagement.Service.OrganiserService;
import com.testing.springpractice.festmanagement.models.Fest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organiser")
public class OrganiserController {
    @Autowired
    OrganiserService service;

    @PostMapping("/addEvent")
    public FestDto addEvent(@RequestBody FestDto request, @RequestParam String organiserId){
        return service.addEvent(request, organiserId);
    }

    @PostMapping("/acceptPayment/{id}/approve")
    public String paymentAccept(@PathVariable String id){
        System.out.println(id);
        return service.paymentAccept(id);
    }

    @GetMapping("/view-all-events")
    public List<Fest> viewallevents(@RequestParam String organiserId){
        return service.viewallevents(organiserId);
    }

    @GetMapping("/view-pending-payments/{festId}")
    public List<BookingResponse> viewPaymentRequests(@RequestParam String organiserId, @PathVariable String festId){
        return service.viewpaymentRequests(organiserId, festId);
    }

    @PutMapping("/cancel-event/{festId}")
    private void deleteEvent(@PathVariable String festId,
                             @RequestParam String organiserId){
        service.deleteEvent(festId, organiserId);

    }

    @PostMapping("/verify-ticket")
    private String verifyTicket(@RequestBody String bookingkey, @RequestParam String organiserId){
        return service.verifyTicket(bookingkey, organiserId);
    }




}
