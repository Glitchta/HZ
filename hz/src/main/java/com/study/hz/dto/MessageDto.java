package com.study.hz.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDto {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long senderId;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long receiverId;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long targetId;
    private String type;
    private String content;
    private String status;
    private LocalDateTime timestamp;
    private Integer isRead;
    private String avatar;
    private String nickname;
}
