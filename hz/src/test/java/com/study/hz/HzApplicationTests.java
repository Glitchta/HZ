package com.study.hz;


import com.study.hz.mapper.HelpMapper;
import com.study.hz.util.UrlFileNameExtractor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class HzApplicationTests {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    HelpMapper helpMapper;
    @Test
    void contextLoads() {
        System.out.println(passwordEncoder.encode("123456"));
    }
    @Test
    void test() {
        System.out.println(helpMapper.selectHelpList(0,5));
    }

}
