package com.study.hz.pojo;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonIgnore;
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


@NoArgsConstructor
@AllArgsConstructor
@Data
@TableName(autoResultMap = true)
public class Hole {
    @TableId(type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    @JsonIgnore
    @JsonSerialize(using = ToStringSerializer.class)
    private Long createUser;
    private String content;
    @TableField(typeHandler = JacksonTypeHandler.class)
    @JsonDeserialize(using = ImagesDeserializer.class)
    private List<String> images = new ArrayList<>();
    private Integer commentCount;
    private Integer likeCount;
    private LocalDateTime createTime;
}


