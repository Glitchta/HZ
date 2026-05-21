package com.study.hz.service;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;

public interface SearchService {
    Result search(String keyword, String type, PageDto pageDto);
}
