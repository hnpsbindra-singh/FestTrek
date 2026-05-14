package com.testing.springpractice.festmanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestDto {

    private String title;
    private String id;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private Long slots;
    private Long cost;
    private String duration;
    private Long ageLimit;
    private String language;
    private String genre;
    private Map<String, Object> location;
}
