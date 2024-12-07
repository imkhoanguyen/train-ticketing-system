package com.example.train.config;

import com.example.train.entity.Discount;
import com.example.train.entity.Promotion;
import com.example.train.entity.User;
import com.example.train.repository.DiscountRepository;
import com.example.train.repository.PromotionRepository;
import com.example.train.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@RequiredArgsConstructor
@Configuration
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, DiscountRepository discountRepository, PromotionRepository promotionRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setUserName("admin");
                user.setPassword(passwordEncoder.encode("Admin_123"));
                user.setEmail("khoasgu01@gmail.com");
                user.setFullName("nguyen anh khoa");
                user.setPhone("0855765900");
                user.setRole("Admin");
                user.setCmnd("855765900");
                userRepository.save(user);

                User user1 = new User();
                user1.setUserName("customer");
                user1.setPassword(passwordEncoder.encode("Customer_123"));
                user1.setEmail("itk21sgu@gmail.com");
                user1.setFullName("nguyen van a");
                user1.setPhone("0147258369");
                user1.setRole("Customer");
                user1.setCmnd("147258369");
                userRepository.save(user1);
            }

            if(discountRepository.count() == 0) {
                Discount discount = new Discount();
                discount.setPrice(new BigDecimal("10000"));
                discount.setObject("Người cao tuổi");
                discount.setDescription("Khách hàng lớn tuổi");
                discountRepository.save(discount);

                Discount discount1 = new Discount();
                discount1.setPrice(new BigDecimal("5000"));
                discount1.setObject("Trẻ em");
                discount1.setDescription("Giảm giá cho trẻ em");
                discountRepository.save(discount1);

                Discount discount2= new Discount();
                discount2.setPrice(new BigDecimal("0"));
                discount2.setObject("Người lớn");
                discount2.setDescription("Giảm giá cho người lớn");
                discountRepository.save(discount2);
            }

            if (promotionRepository.count() == 0) {
                // Tạo đối tượng Promotion đầu tiên
                Promotion promotion1 = new Promotion();
                promotion1.setPrice(new BigDecimal("50000"));
                promotion1.setName("Summer Sale 2024");
                promotion1.setDescription("Giảm giá mùa hè 2024");
                promotion1.setCode("SUMMER2024");
                promotion1.setCount(100);
                promotion1.setStartDate(ZonedDateTime.now());
                promotion1.setEndDate(ZonedDateTime.now().plusMonths(1)); // Ngày kết thúc là một tháng sau
                promotionRepository.save(promotion1);

                Promotion promotion2 = new Promotion();
                promotion2.setPrice(new BigDecimal("10000"));
                promotion2.setName("Black Friday Deal");
                promotion2.setDescription("Giảm giá nhân dịp Black Friday");
                promotion2.setCode("BLACKFRIDAY2024");
                promotion2.setCount(50);
                promotion2.setStartDate(ZonedDateTime.now());
                promotion2.setEndDate(ZonedDateTime.now().plusMonths(2));
                promotionRepository.save(promotion2);

                // Tạo đối tượng Promotion thứ ba
                Promotion promotion3 = new Promotion();
                promotion3.setPrice(new BigDecimal("30000"));
                promotion3.setName("Christmas Sale");
                promotion3.setDescription("Khuyến mãi Giáng Sinh");
                promotion3.setCode("CHRISTMAS2024");
                promotion3.setCount(200);
                promotion3.setStartDate(ZonedDateTime.now());
                promotion3.setEndDate(ZonedDateTime.now().plusMonths(3));
                promotionRepository.save(promotion3);
            }
        };
    }
}
