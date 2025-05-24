package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.repository.RoomRepository;
import com.javaweb.cinema.persistence.repository.UserRepository;
import com.javaweb.cinema.service.RoomService;
import com.javaweb.cinema.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class RoomManagementController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

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
                                          @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("roomId").ascending());
        Page<RoomDTO> rooms = roomService.findRooms(pageable);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestBody RoomDTO roomDTO){
        try {
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

    @PutMapping("rooms/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        Optional<RoomResponseDTO> updated = roomService.updateRoom(id, roomDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("Phòng không tồn tại");
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
