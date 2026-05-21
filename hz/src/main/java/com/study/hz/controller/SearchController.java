package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;
import com.study.hz.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @PostMapping
    public Result search(@RequestBody Map<String, Object> params) {
        String keyword = params.get("keyword") != null ? params.get("keyword").toString() : "";
        String type = params.get("type") != null ? params.get("type").toString() : "";
        PageDto pageDto = new PageDto();
        pageDto.setCurrent(params.get("current") != null ? (int) params.get("current") : 1);
        pageDto.setSize(params.get("size") != null ? (int) params.get("size") : 10);
        return searchService.search(keyword, type, pageDto);
    }
}
