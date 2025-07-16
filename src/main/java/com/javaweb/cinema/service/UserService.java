package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.UserDTO;
import com.javaweb.cinema.api.dto.UserResponseDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.User;
import com.javaweb.cinema.persistence.repository.CinemaRepository;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MapperRepository mapperRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    public UserDTO addUser(UserDTO userDTO) {
        User user1 = mapperRepository.userDTOToUser(userDTO);
        user1.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user1 = userRepository.save(user1);
        return mapperRepository.userToUserDTO(user1);
    }

    public boolean checkPhoneExists(String phone) {
        return userRepository.existsByPhone(phone);
    }
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public Optional<User> findUserById(Long id) {
        Optional<User> user1 = userRepository.findById(id);
        return user1;
    }

    public Page<User> findUserByRole(int userType, Pageable pageable) {
        List<String> roles = new ArrayList<>();
        if(userType == 1) {
            Collections.addAll(roles, "ADMIN");
        } else {
            Collections.addAll(roles, "GUEST", "MEMBER");
        }

        // Tao pageable moi voi sort theo userId tang dan
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.ASC, "userId") // Sắp xếp theo userId
        );

        return userRepository.findByRoleIn(roles, sortedPageable);
    }

    public User createUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
        }

        User user = new User();
        user.setImage(userDTO.getImage());
        user.setName(userDTO.getName());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        user.setRole(userDTO.getRole());
        user.setPosition(userDTO.getPosition());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setPersonalId(userDTO.getPersonalId());

        if (userDTO.getCinemaId() != null) {
            Cinema cinema = cinemaRepository.findById(userDTO.getCinemaId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy rạp chiếu với ID: " + userDTO.getCinemaId()));
            user.setCinema(cinema);
        }
        return userRepository.save(user);
    }

    public Optional<UserResponseDTO> updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id).map(user -> {

            user.setName(userDTO.getName());
            if (userDTO.getImage() != null && !userDTO.getImage().isEmpty()) {
                user.setImage(userDTO.getImage());
            }

            user.setDateOfBirth(userDTO.getDateOfBirth());
            user.setPhone(userDTO.getPhone());
            user.setEmail(userDTO.getEmail());
            user.setPersonalId(userDTO.getPersonalId());
            user.setUsername(userDTO.getUsername());
            user.setAccountStatus(userDTO.getAccountStatus());
            user.setPosition(userDTO.getPosition());
            user.setRole(userDTO.getRole());

            // Cập nhật mật khẩu nếu có
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            if (userDTO.getCinemaId() != null) {
                Cinema cinema = cinemaRepository.findById(userDTO.getCinemaId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp với ID: " + userDTO.getCinemaId()));
                user.setCinema(cinema);
            }

            User updatedUser = userRepository.save(user);

            return new UserResponseDTO(updatedUser);
        });
    }

    public boolean deleteUser(Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

}
