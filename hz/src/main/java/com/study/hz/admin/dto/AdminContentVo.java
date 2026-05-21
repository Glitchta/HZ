package com.study.hz.admin.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminContentVo {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String type;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long createUser;
    private String nickname;
    private String title;
    private String description;
    private Integer commentCount;
    private Integer likeCount;
    private LocalDateTime createTime;
}
