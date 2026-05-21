package com.study.hz.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDto {
    private int current;
    private int size;
    private int offset;
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
}
