package com.study.hz.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result <T>{
private Integer code;
private String msg;
private T data;

public static <E> Result success(Integer code,String message, E data) {
    return new Result(code,message,data);
}
public static <E> Result success(String message, E data) {
        return success(0,message,data);
    }
public static <E> Result success(E data) {
    return success(0,"操作成功",data);
}
public static Result success() {
    return success(null);
}
public static Result error(String message) {
    return new Result(-1,message,null);
}
public static Result error() {
    return new Result(-1,"操作失败",null);
}
}
