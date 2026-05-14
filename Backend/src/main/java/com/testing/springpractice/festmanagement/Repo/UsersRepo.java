package com.testing.springpractice.festmanagement.Repo;

import com.testing.springpractice.festmanagement.models.Users;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsersRepo extends MongoRepository<Users, String> {
    Users findByUsername(String username);


}
