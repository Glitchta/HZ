package com.study.hz.service;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;

public interface MyPostsService {
    Result getMyPostList(PageDto pageDto, String type);
    Result deleteMyPost(Long id, String type);
}
