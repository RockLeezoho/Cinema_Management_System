package com.javaweb.cinema.api.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.repository.RoomRepository;
import com.javaweb.cinema.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
public class RoomManagementController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> searchRoomById(@PathVariable Long id) {
        Optional<Room> roomOptional = roomService.findRoomById(id);

        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            RoomResponseDTO roomDTO = new RoomResponseDTO(room);
            System.out.println("RoomDTO: " + roomDTO);
            return ResponseEntity.ok(roomDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getAllRooms(@RequestParam int page,
                                         @RequestParam int size,
                                         @RequestParam Long cinemaId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("roomId").ascending());
        Page<RoomDTO> rooms = roomService.findRooms(cinemaId, pageable);
        System.out.println(rooms);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping(value = "/rooms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRoom(
            @RequestParam("room") String roomJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            RoomDTO roomDTO = objectMapper.readValue(roomJson, RoomDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "rooms";
                System.out.println("UploadDir = " + uploadDir);

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                roomDTO.setImage("/images/rooms/" + uniqueFileName);
            }

            RoomDTO createdRoom = roomService.addRoom(roomDTO);
            System.out.println("Received RoomDTO: " + createdRoom);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
        } catch (IllegalArgumentException e) {
            // Loi validate (username da ton tai)
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Loi khong xac dinh
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo phòng.");
        }
    }

    @PutMapping(value = "rooms/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateRoom(
            @PathVariable Long id,
            @RequestParam("room") String roomJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            RoomDTO roomDTO = objectMapper.readValue(roomJson, RoomDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "rooms";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                roomDTO.setImage("/images/rooms/" + uniqueFileName);
            }
            Optional<RoomResponseDTO> updated = roomService.updateRoom(id, roomDTO);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(404).body("Phòng không tồn tại");
            }
        } catch (JsonProcessingException e) {
            System.out.println("Lỗi parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body("Dữ liệu phòng không hợp lệ.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật phòng.");
        }
    }

//    @DeleteMapping("rooms/{id}")
//    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
//        boolean deleted = roomService.deleteRoom(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa phòng thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng để xóa");
//        }
//    }

}
