package com.study.hz.dto;

import lombok.Data;

@Data
public class TokenDto {
    private String refreshToken;
    private String accessToken;
}