package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.BookingDetailDTO;
import com.javaweb.cinema.api.dto.ItemQuantity;
import com.javaweb.cinema.api.dto.MovieResponseDTO;
import com.javaweb.cinema.api.dto.UserResponseDTO;
import com.javaweb.cinema.config.VnPayConfig;
import com.javaweb.cinema.persistence.entity.*;
import com.javaweb.cinema.persistence.repository.*;
import com.javaweb.cinema.storage.BookingStorage;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
public class VnPayService {

    @Autowired
    private VnPayConfig vnpayConfig;

    @Autowired
    private BookingStorage bookingStorage;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ConcessionRepository concessionRepository;

    @Autowired
    private InvoiceConcessionRepository invoiceConcessionRepository;

    public String createPayment(BookingDetailDTO bookingDetailDTO, String bookingId) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";

        long amount = 0;
        String strAmount = bookingDetailDTO.getTotalPrice();

        if (strAmount == null || strAmount.trim().isEmpty()) {
            throw new IllegalArgumentException("Số tiền không được để trống");
        }

        try {
            amount = amount = (long)(Double.parseDouble(bookingDetailDTO.getTotalPrice()) * 100);;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Số tiền không hợp lệ");
        }

        String bankCode = "NCB";
        String vnp_TxnRef = bookingId;//vnpayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = vnpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnpayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append('&');
                hashData.append('&');
            }
        }

        if (query.length() > 0)
            query.setLength(query.length() - 1);
        if (hashData.length() > 0)
            hashData.setLength(hashData.length() - 1);

        String vnp_SecureHash = vnpayConfig.hmacSHA512(vnpayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        return vnpayConfig.vnp_PayUrl + "?" + query;
    }


    public ResponseEntity<?> handlePaymentReturn(String responseCode, String bookingId) {
        if (!"00".equals(responseCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Thanh toán thất bại! Mã lỗi: " + responseCode);
        }

        BookingDetailDTO bookingDetail = bookingStorage.get(bookingId);
        if (bookingDetail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy thông tin booking!");
        }

        // Kiểm tra dữ liệu đầu vào
        if (bookingDetail.getTicketTypeId() == null || bookingDetail.getSelectedSeatName() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Thiếu thông tin vé hoặc ghế đã chọn.");
        }

        // 1. Tìm hoặc tạo user
        User user = userRepository.findByEmail(bookingDetail.getCustomerEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(bookingDetail.getCustomerName());
                    newUser.setEmail(bookingDetail.getCustomerEmail());
                    newUser.setPhone(bookingDetail.getCustomerPhone());
                    newUser.setRole("GUEST");
                    return userRepository.save(newUser);
                });

        // 2. Tạo invoice
        Invoice invoice = new Invoice();
        invoice.setPaymentMethod(bookingDetail.getPaymentMethod());
        invoice.setPaymentDate(bookingDetail.getPaymentDate() != null ? bookingDetail.getPaymentDate() : LocalDate.now());
        invoice.setUser(user);
        invoice = invoiceRepository.save(invoice);

        // 3. Tạo ticket
        TicketType ticketType = ticketTypeRepository.findById(bookingDetail.getTicketTypeId())
                .orElseThrow(() -> new RuntimeException("Loại vé không tồn tại"));

        Seat seat = seatRepository.findByName(bookingDetail.getSelectedSeatName())
                .orElseThrow(() -> new RuntimeException("Ghế không tồn tại"));

        Showtime showtime = showtimeRepository.findById(bookingDetail.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Suất chiếu không tồn tại"));

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setPaymentDate(invoice.getPaymentDate());
        ticket.setPaymentMethod(bookingDetail.getPaymentMethod());
        ticket.setTicketType(ticketType);
        ticket.setSeat(seat);
        ticket.setShowtime(showtime);
        ticketRepository.save(ticket);

        // 4. Lưu các món concession (nếu có)
        if (bookingDetail.getConcessionsId() != null) {
            for (ItemQuantity item : bookingDetail.getConcessionsId()) {
                Concession concession = concessionRepository.findById(item.getId())
                        .orElseThrow(() -> new RuntimeException("Concession không tồn tại"));

                InvoiceConcession invoiceConcession = new InvoiceConcession();
                invoiceConcession.setInvoice(invoice);
                invoiceConcession.setConcession(concession);
                invoiceConcession.setQuantity(item.getQuantity());

                invoiceConcessionRepository.save(invoiceConcession);
            }
        }

        // 5. Cập nhật lượt xem cho phim
        Movie movie = showtime.getMovie();
        if (movie != null) {
            movie.setViewer(movie.getViewer() + 1);
            movieRepository.save(movie);
        }

        // 6. Xoá booking khỏi bộ nhớ tạm
        bookingStorage.remove(bookingId);

        return ResponseEntity.ok("Thanh toán thành công và lưu thông tin vé vào cơ sở dữ liệu!");
    }


}
