package com.study.hz.admin.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;

@Data
public class AdminUserVo {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String username;
    private String openid;
    private String role;
    private Integer status;
    private String nickname;
    private String avatar;
    private String phone;
    private String email;
    private String major;
    private Integer gender;
    private String sign;
    private String birthday;
}
