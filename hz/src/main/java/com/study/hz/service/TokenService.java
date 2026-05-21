package com.study.hz.service;

import com.study.hz.dto.TokenDto;
import com.study.hz.pojo.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

public interface TokenService {
    Result refreshToken(@RequestBody TokenDto request);

    Result logout(@RequestHeader("Authorization") String authHeader);

    String refreshAccessToken(String refreshToken);

    String rotateRefreshToken(String oldRefreshToken);

    boolean existsRefreshToken(Long userId) ;

}
