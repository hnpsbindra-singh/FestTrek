package com.testing.springpractice.festmanagement.Service;

import com.testing.springpractice.festmanagement.DTO.BookingResponse;
import com.testing.springpractice.festmanagement.DTO.FestDto;
import com.testing.springpractice.festmanagement.Repo.BookingsRepo;
import com.testing.springpractice.festmanagement.Repo.FestRepo;
import com.testing.springpractice.festmanagement.Repo.UsersRepo;
import com.testing.springpractice.festmanagement.models.Bookings;
import com.testing.springpractice.festmanagement.models.Fest;
import com.testing.springpractice.festmanagement.models.PaymentStatus;
import com.testing.springpractice.festmanagement.models.Users;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class OrganiserService {
    @Autowired
    FestRepo festRepo;
    @Autowired
    BookingsRepo bookingsRepo;
    @Autowired
    EmailService emailService;
    @Autowired
    UsersRepo usersRepo;
    public FestDto addEvent(
            @NonNull FestDto request,
            String organiserId
    ) {

        Fest fest = new Fest();

        fest.setTitle(
                request.getTitle()
        );

        fest.setOrganiserId(
                organiserId
        );

        fest.setTime(
                request.getTime()
        );

        fest.setSlots(
                request.getSlots()
        );

        List<Double> coordinates =
                (List<Double>)
                        request.getLocation()
                                .get("coordinates");

        GeoJsonPoint point =
                new GeoJsonPoint(

                        coordinates.get(0),

                        coordinates.get(1)
                );

        fest.setLocation(point);

        fest.setLanguage(
                request.getLanguage()
        );

        fest.setGenre(
                request.getGenre()
        );

        fest.setDuration(
                request.getDuration()
        );

        fest.setDescription(
                request.getDescription()
        );

        fest.setDate(
                request.getDate()
        );

        fest.setCost(
                request.getCost()
        );

        fest.setActive(true);

        fest.setAgeLimit(
                request.getAgeLimit()
        );

        Fest saved =
                festRepo.save(fest);

        return mapToResponse(saved);
    }
    private FestDto mapToResponse(
            Fest fest
    ) {

        FestDto response =
                new FestDto();

        response.setTitle(
                fest.getTitle()
        );

        response.setTime(
                fest.getTime()
        );

        response.setSlots(
                fest.getSlots()
        );

        Map<String, Object> location =
                new HashMap<>();

        location.put(
                "type",
                "Point"
        );

        location.put(
                "coordinates",

                List.of(

                        fest.getLocation().getX(),

                        fest.getLocation().getY()
                )
        );

        response.setLocation(location);

        response.setLanguage(
                fest.getLanguage()
        );

        response.setGenre(
                fest.getGenre()
        );

        response.setDuration(
                fest.getDuration()
        );

        response.setDescription(
                fest.getDescription()
        );

        response.setDate(
                fest.getDate()
        );

        response.setCost(
                fest.getCost()
        );

        response.setAgeLimit(
                fest.getAgeLimit()
        );

        return response;
    }

    public String paymentAccept(String id) {

        System.out.println(id);
        Bookings bookings = bookingsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        Fest fest = festRepo.findById(bookings.getFestId())
                .orElseThrow(() -> new RuntimeException("Fest Not Found"));

        Users user = usersRepo.findByUsername(bookings.getUserId());

        if (bookings.getPaymentStatus() != PaymentStatus.PAYMENT_SUBMITTED) {
            return "Payment not submitted yet or already verified";
        }

        if (fest.getSlots() != null &&
                fest.getSlots() < bookings.getSlots()) {

            throw new RuntimeException(
                    "Not enough slots available"
            );
        }
        bookings.setPaymentStatus(PaymentStatus.PAYMENT_VERIFIED);

        String key = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
        bookings.setBookingKey(key);

        if(fest.getSlots() != null) {

            fest.setSlots(
                    fest.getSlots()
                            - bookings.getSlots()
            );
        }

        festRepo.save(fest);
        bookingsRepo.save(bookings);

        emailService.sendConfirmationMail(key, user.getUsername());

        return "Verified Successfully";
    }

    public List<Fest> viewallevents(String organiserId) {
        return festRepo.findByOrganiserIdAndActiveTrue(organiserId);
    }

    private BookingResponse mapToRes(
            Bookings booking
    ) {

        BookingResponse response =
                new BookingResponse();

        response.setBookingKey(booking.getBookingKey());
        response.setId(
                booking.getId()
        );
        response.setFestId(
                booking.getFestId()
        );

        response.setUserId(
                booking.getUserId()
        );

        response.setSlots(
                booking.getSlots()
        );

        response.setTotalCost(
                booking.getTotalCost()
        );

        response.setBookingDatetime(
                booking.getBookingDatetime()
        );

        response.setPaymentStatus(
                booking.getPaymentStatus()
        );

        return response;
    }
    public List<BookingResponse> viewpaymentRequests(
            String organiserId,
            String festId) {
       Fest fest= festRepo.findById(festId).orElse(null);
        if (fest == null) {
            throw new RuntimeException(
                    "Fest not found"
            );
        }
        if(!fest.getOrganiserId().equals(organiserId)){
            throw new RuntimeException("Invalid Access");
        }
        List<Bookings> bookings = bookingsRepo.findByFestIdAndPaymentStatus(fest.getId(), PaymentStatus.PAYMENT_SUBMITTED);

        return bookings.stream()
                .map(this::mapToRes)
                .toList();
    }


    public void deleteEvent(String festId, String organiserId) {
        Fest fest = festRepo.findById(festId).orElse(null);
        if(fest==null){
            throw new RuntimeException("Invalid Fest/ Doesn't Exist");
        }
        if(!Objects.equals(fest.getOrganiserId(), organiserId)){
            throw new RuntimeException("Invalid Request");
        }
        fest.setActive(false);
       festRepo.save(fest);
    }

    public String verifyTicket(String bookingkey, String organiserId) {
        Bookings booking = bookingsRepo.findByBookingKey(bookingkey);
        if(booking == null){
            throw new RuntimeException("Booking Not Found");
        }

        Fest fest = festRepo.findById(booking.getFestId()).orElse(null);
        if(fest==null){
            throw new RuntimeException("Fest not Found");
        }

        if(!fest.getOrganiserId().equals(organiserId)){
            throw new RuntimeException("Invalid Access");
        }

        if (booking.getPaymentStatus()
                != PaymentStatus
                .PAYMENT_VERIFIED) {

            throw new RuntimeException(
                    "Payment Not Verified"
            );
        }

        if(booking.isCheckedIn()){
            throw new RuntimeException("User already Checked In");
        }
        booking.setCheckedIn(true);
        bookingsRepo.save(booking);


        return "Entry Allowed";
    }
}
