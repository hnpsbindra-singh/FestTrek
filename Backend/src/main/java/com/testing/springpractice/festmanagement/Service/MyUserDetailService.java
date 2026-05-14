package com.testing.springpractice.festmanagement.Service;

import com.testing.springpractice.festmanagement.Repo.UsersRepo;
import com.testing.springpractice.festmanagement.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    UsersRepo repo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = repo.findByUsername(username);
        if(users==null)
        {
            throw new RuntimeException("No such User Exist");
        }
        return users ;
    }
}
