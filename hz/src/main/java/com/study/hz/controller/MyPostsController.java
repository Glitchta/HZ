package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;
import com.study.hz.service.MyPostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/my-posts")
public class MyPostsController {

    @Autowired
    private MyPostsService myPostsService;

    @PostMapping("/list")
    public Result getMyPostList(@RequestBody Map<String, Object> params) {
        PageDto pageDto = new PageDto();
        pageDto.setCurrent(params.get("current") != null ? (int) params.get("current") : 1);
        pageDto.setSize(params.get("size") != null ? (int) params.get("size") : 10);
        String type = params.get("type") != null ? params.get("type").toString() : "";
        return myPostsService.getMyPostList(pageDto, type);
    }

    @PostMapping("/delete")
    public Result deleteMyPost(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        String type = params.get("type") != null ? params.get("type").toString() : "";
        return myPostsService.deleteMyPost(id, type);
    }
}
