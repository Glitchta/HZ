package com.study.hz.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.study.hz.util.ImagesDeserializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@TableName(autoResultMap = true)
public class HelpDto {
    @TableId(type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long createUser;
    private String Type;
    private String title;
    private String description;
    @TableField(typeHandler = JacksonTypeHandler.class)
    @JsonDeserialize(using = ImagesDeserializer.class)
    private List<String> images = new ArrayList<>();
    private String contactType;
    private String contact;
    private String helpType;
    private String status;
    private Integer likeCount;
    private String avatar;
    private String nickname;
    private LocalDateTime createTime;
}
