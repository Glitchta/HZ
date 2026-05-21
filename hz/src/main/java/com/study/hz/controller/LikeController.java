package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;
import com.study.hz.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/like")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/add")
    public Result addLike(@RequestBody Map<String, Object> params) {
        Long contentId = Long.valueOf(params.get("contentId").toString());
        String contentType = (String) params.get("contentType");
        return likeService.addLike(contentId, contentType);
    }

    @PostMapping("/cancel")
    public Result cancelLike(@RequestBody Map<String, Object> params) {
        Long contentId = Long.valueOf(params.get("contentId").toString());
        String contentType = (String) params.get("contentType");
        return likeService.cancelLike(contentId, contentType);
    }

    @PostMapping("/check")
    public Result checkLike(@RequestBody Map<String, String> params) {
        Long contentId = Long.valueOf(params.get("contentId"));
        String contentType = params.get("contentType");
        return likeService.checkLike(contentId, contentType);
    }

    @PostMapping("/list")
    public Result getLikeList(@RequestBody Map<String, Object> params) {
        PageDto pageDto = new PageDto();
        pageDto.setCurrent(params.get("current") != null ? (int) params.get("current") : 1);
        pageDto.setSize(params.get("size") != null ? (int) params.get("size") : 10);
        String contentType = params.get("contentType") != null ? params.get("contentType").toString() : "";
        return likeService.getLikeList(pageDto, contentType);
    }
}
