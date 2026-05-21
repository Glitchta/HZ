package com.study.hz.service.impl;

import com.study.hz.dto.MyPostDto;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.SearchMapper;
import com.study.hz.pojo.Result;
import com.study.hz.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private SearchMapper searchMapper;

    private static final List<String> ALL_TYPES = Arrays.asList("help", "lost", "hole", "alumni");

    @Override
    public Result search(String keyword, String type, PageDto pageDto) {
        int offset = (pageDto.getCurrent() - 1) * pageDto.getSize();
        String kw = (keyword != null) ? keyword.trim() : "";
        List<String> typeList = (type == null || type.isEmpty()) ? ALL_TYPES : Arrays.asList(type);
        List<MyPostDto> results = searchMapper.search(kw, typeList, offset, pageDto.getSize());
        return Result.success(results);
    }
}
