package com.testing.springpractice.festmanagement.Repo;

import com.testing.springpractice.festmanagement.models.Fest;

import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FestRepo
        extends MongoRepository<Fest, String> {

    List<Fest>
    findByOrganiserIdAndActiveTrue(
            String organiserId
    );

    List<Fest>
    findByLocationNearAndActiveTrue(
            Point point,
            Distance distance
    );
}