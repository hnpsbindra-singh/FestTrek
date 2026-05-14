package com.testing.springpractice.festmanagement.Service;

import com.testing.springpractice.festmanagement.DTO.BookingRequest;
import com.testing.springpractice.festmanagement.DTO.BookingResponse;
import com.testing.springpractice.festmanagement.DTO.FestDto;
import com.testing.springpractice.festmanagement.DTO.OrganiserPaymentDetails;
import com.testing.springpractice.festmanagement.Repo.BookingsRepo;
import com.testing.springpractice.festmanagement.Repo.FestRepo;
import com.testing.springpractice.festmanagement.Repo.UsersRepo;
import com.testing.springpractice.festmanagement.models.Bookings;
import com.testing.springpractice.festmanagement.models.Fest;
import com.testing.springpractice.festmanagement.models.PaymentStatus;
import com.testing.springpractice.festmanagement.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    FestRepo repo;

    @Autowired
    BookingsRepo bookingsRepo;

    @Autowired
    EmailService service;
    @Autowired
    private UsersRepo usersRepo;

    private FestDto mapToDto(Fest fest) {

        FestDto dto = new FestDto();
        dto.setId(
                fest.getId()
        );

        dto.setTitle(
                fest.getTitle()
        );

        dto.setDescription(
                fest.getDescription()
        );

        dto.setDate(
                fest.getDate()
        );

        dto.setTime(
                fest.getTime()
        );

        dto.setSlots(
                fest.getSlots()
        );

        dto.setCost(
                fest.getCost()
        );

        dto.setDuration(
                fest.getDuration()
        );

        dto.setAgeLimit(
                fest.getAgeLimit()
        );

        dto.setLanguage(
                fest.getLanguage()
        );

        dto.setGenre(
                fest.getGenre()
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

        dto.setLocation(location);

        return dto;
    }
    public List<FestDto> viewAlleventsNearby(double latitude,
                                             double longitude,
                                             double radiusKm)
    {
        List<Fest> AllFests= repo.findByLocationNearAndActiveTrue(new Point(longitude,latitude), new Distance(radiusKm, Metrics.KILOMETERS));

        return AllFests.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public BookingResponse bookevent(
            String festId,
            String userId,
            BookingRequest request
    ) {

        Fest fest = repo.findById(
                festId
        ).orElse(null);

        if (fest == null) {

            throw new RuntimeException(
                    "Fest Not Found"
            );
        }

        if (!Boolean.TRUE.equals(
                fest.getActive()
        )) {

            throw new RuntimeException(
                    "Event Not Available"
            );
        }

        Users organiser =
                usersRepo.findByUsername(
                        fest.getOrganiserId()
                );

        if (organiser == null) {

            throw new RuntimeException(
                    "Organiser Not Found"
            );
        }

        Users user =
                usersRepo.findByUsername(
                        userId
                );

        if (user == null) {

            throw new RuntimeException(
                    "User Not Found"
            );
        }

        if (request.getSlots() == null ||
                request.getSlots() <= 0) {

            throw new RuntimeException(
                    "Invalid slot count"
            );
        }

        if (fest.getSlots() != null &&
                fest.getSlots()
                        < request.getSlots()) {

            throw new RuntimeException(
                    "Not enough slots available"
            );
        }

        Bookings booking = new Bookings();

        booking.setUserId(userId);

        booking.setSlots(
                request.getSlots()
        );

        booking.setTotalCost(
                request.getSlots()
                        * fest.getCost()
        );

        booking.setFestId(festId);

        booking.setBookingDatetime(
                LocalDateTime.now()
        );

        booking.setPaymentStatus(
                PaymentStatus.PAYMENT_PENDING
        );

        Bookings saved =
                bookingsRepo.save(booking);

        OrganiserPaymentDetails details =
                new OrganiserPaymentDetails(

                        organiser.getUpiId(),

                        organiser.getBankAccountNumber(),

                        organiser.getIfscCode(),

                        organiser.getAccountHolderName()
                );

        service.sendPaymentDetails(

                user.getUsername(),

                fest.getTitle(),

                booking.getSlots(),

                booking.getTotalCost(),

                details
        );

        return mapToResponse(saved);
    } private BookingResponse mapToResponse(
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

    public FestDto viewEvent(String festId) {
        Fest fest = repo.findById(festId).orElse(null);
        if(fest==null){
            throw new RuntimeException("Fest Not Found");
        }
        if(!Boolean.TRUE.equals(
                fest.getActive()
        )) {

            throw new RuntimeException(
                    "Event Not Available"
            );
        }
        return mapToDto(fest);
    }

    public String submitPayment(String bookingId, String userId)
    {

        System.out.println(bookingId);
        Bookings booking =
                bookingsRepo.findById(
                        bookingId
                ).orElse(null);

        if (booking == null) {

            throw new RuntimeException(
                    "Booking Not Found"
            );
        }

        if (!booking.getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "Invalid Access"
            );
        }

        if (booking.getPaymentStatus()
                != PaymentStatus
                .PAYMENT_PENDING) {

            throw new RuntimeException(
                    "Payment Already Submitted or Verified"
            );
        }

        booking.setPaymentStatus(
                PaymentStatus
                        .PAYMENT_SUBMITTED
        );

        bookingsRepo.save(booking);

        return "Payment Submitted Successfully";
    }

    public List<BookingResponse> myBookings(
            String userId
    ) {

        List<Bookings> bookings =
                bookingsRepo.findByUserId(
                        userId
                );

        return bookings.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookingResponse viewTicket(

            String bookingId,

            String userId
    ) {

        Bookings booking =
                bookingsRepo.findById(
                        bookingId
                ).orElse(null);

        if (booking == null) {

            throw new RuntimeException(
                    "Booking Not Found"
            );
        }

        if (!booking.getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "Invalid Access"
            );
        }

        if (booking.getPaymentStatus()
                != PaymentStatus
                .PAYMENT_VERIFIED) {

            throw new RuntimeException(
                    "Ticket Not Verified Yet"
            );
        }

        return mapToResponse(booking);
    }
}
