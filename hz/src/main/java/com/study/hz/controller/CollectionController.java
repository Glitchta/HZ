package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;
import com.study.hz.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/collection")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    @PostMapping("/add")
    public Result addCollection(@RequestBody Map<String, Object> params) {
        Long contentId = Long.valueOf(String.valueOf(params.getOrDefault("contentId", params.get("helpId"))));
        String contentType = params.get("contentType") != null ? (String) params.get("contentType") : "help";
        return collectionService.addCollection(contentId, contentType);
    }

    @PostMapping("/cancel")
    public Result cancelCollection(@RequestBody Map<String, Object> params) {
        Long contentId = Long.valueOf(String.valueOf(params.getOrDefault("contentId", params.get("helpId"))));
        String contentType = params.get("contentType") != null ? (String) params.get("contentType") : "help";
        return collectionService.cancelCollection(contentId, contentType);
    }

    @PostMapping("/check")
    public Result checkCollection(@RequestBody Map<String, String> params) {
        String idStr = params.getOrDefault("contentId", params.get("helpId"));
        Long contentId = Long.valueOf(idStr);
        String contentType = params.getOrDefault("contentType", "help");
        return collectionService.checkCollection(contentId, contentType);
    }

    @PostMapping("/list")
    public Result getCollectionList(@RequestBody Map<String, Object> params) {
        PageDto pageDto = new PageDto();
        pageDto.setCurrent(params.get("current") != null ? (int) params.get("current") : 1);
        pageDto.setSize(params.get("size") != null ? (int) params.get("size") : 10);
        String contentType = params.get("contentType") != null ? params.get("contentType").toString() : "";
        return collectionService.getCollectionList(pageDto, contentType);
    }
}
