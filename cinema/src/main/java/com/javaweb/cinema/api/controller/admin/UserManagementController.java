package com.javaweb.cinema.api.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.cinema.api.dto.UserDTO;
import com.javaweb.cinema.api.dto.UserResponseDTO;
import com.javaweb.cinema.persistence.entity.User;
import com.javaweb.cinema.persistence.repository.UserRepository;
import com.javaweb.cinema.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class UserManagementController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping("/users/{id}")
    public ResponseEntity<?> searchUserById(@PathVariable Long id) {
        Optional<User> userOptional = userService.findUserById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            UserResponseDTO userDTO = new UserResponseDTO(user);
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam int page,
                                         @RequestParam int size,
                                         @RequestParam int userType) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.findUserByRole(userType, pageable);
        Page<UserResponseDTO> pageDTO = users.map(UserResponseDTO::new);
        return ResponseEntity.ok(pageDTO);
    }

    @PostMapping(value = "/users", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createUser(
            @RequestParam("user") String userJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            UserDTO userDTO = objectMapper.readValue(userJson, UserDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "users";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                userDTO.setImage("/images/users/" + uniqueFileName);
            }

            User createdUser = userService.createUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);

        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Dữ liệu user không hợp lệ.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi tạo người dùng.");
        }
    }


    @PutMapping(value = "users/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @RequestParam("user") String userJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            //Parse chuỗi JSON user sang DTO
            UserDTO userDTO = objectMapper.readValue(userJson, UserDTO.class);

            //Nếu có ảnh mới, lưu ảnh vào thư mục
            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "users";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                userDTO.setImage("/images/users/" + uniqueFileName);
            }

            //Gọi service cập nhật user
            Optional<UserResponseDTO> updated = userService.updateUser(id, userDTO);

            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại");
            }

        } catch (JsonProcessingException e) {
            System.out.println("Lỗi parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body("Dữ liệu user không hợp lệ.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật người dùng.");
        }
    }


//    @DeleteMapping("users/{id}")
//    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
//        boolean deleted = userService.deleteUser(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa người dùng thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng để xóa");
//        }
//    }

}
