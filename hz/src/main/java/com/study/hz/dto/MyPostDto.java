package com.study.hz.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.study.hz.util.ImagesDeserializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyPostDto {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String type;
    private String title;
    private String content;
    @JsonDeserialize(using = ImagesDeserializer.class)
    private List<String> images = new ArrayList<>();
    private String status;
    private Integer commentCount;
    private Integer likeCount;
    private Integer viewCount;
    private LocalDateTime createTime;
}
