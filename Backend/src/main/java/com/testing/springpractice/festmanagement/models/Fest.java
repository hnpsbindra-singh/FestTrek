package com.testing.springpractice.festmanagement.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "fests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fest {
    @Id
    private String id;
    private String organiserId;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private Long slots;
    private Long cost;
    private String duration;
    private Long ageLimit;
    private String language;
    private String genre;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;
    private Boolean active = true;


}
