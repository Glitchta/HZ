package com.study.hz.pojo;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;


@Data

public class UserInfo {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long userId;
    private String nickname;
    private String avatar;
    private String sign;
    private Integer gender;
    private String birthday;
    private String major;
    private String phone;
    private String email;
}