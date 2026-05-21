package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Dynamic;
import com.study.hz.pojo.Result;
import com.study.hz.service.DynamicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dynamic")
public class DynamicController {
    @Autowired
    private DynamicService dynamicService;

    @PostMapping("/list")
    public Result selectDynamicList(@RequestBody PageDto pageDto) {
        return dynamicService.selectDynamicList(pageDto);
    }

    @PostMapping("/insert")
    public Result insertDynamic(@RequestBody Dynamic dynamic) {
        return dynamicService.insertDynamic(dynamic);
    }

    @GetMapping("/getById")
    public Result getById(@RequestParam("id") Long id) {
        return dynamicService.getById(id);
    }

    @PostMapping("/like")
    public Result toggleLike(@RequestBody Map<String, Object> params) {
        Long dynamicId = Long.valueOf(params.get("dynamicId").toString());
        Boolean isLike = (Boolean) params.get("isLike");
        return dynamicService.toggleLike(dynamicId, isLike);
    }
    @PutMapping("/comment")
    public Result updateComment(@RequestParam("id") Long id){
        return dynamicService.updateComment(id);
    }
}
