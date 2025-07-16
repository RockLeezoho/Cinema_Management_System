package com.javaweb.cinema.service;

import com.javaweb.cinema.persistence.entity.User;
import com.javaweb.cinema.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("CustomUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        Optional<User> optionalUser;

        if(input.contains("@")) {
            optionalUser = userRepository.findByEmail(input);
        } else if(input.matches("\\d+")) { //match one or more digits
            optionalUser = userRepository.findByPhone(input);
        }else {
            optionalUser = userRepository.findByUsername(input);
        }

        User user = optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found")); //get value inside Optionalxs

        //Get the list of permissions (authorities) to compare the user's authorities with the endpoint's authorization requirements
        List<GrantedAuthority> authorityList = List.of(
              new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );

        // Converting User to UserDetails
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorityList
        );
    }

    public UserDetails setUserDetails(String username, String password, String role) {
        List<GrantedAuthority> authorityList = List.of(
                new SimpleGrantedAuthority("ROLE_" + role)
        );
        return new org.springframework.security.core.userdetails.User(
                username,
                password,
                authorityList
        );
    }
}
