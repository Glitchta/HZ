package com.study.hz.service;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Result;

public interface LikeService {
    Result addLike(Long contentId, String contentType);
    Result cancelLike(Long contentId, String contentType);
    Result checkLike(Long contentId, String contentType);
    Result getLikeList(PageDto pageDto, String contentType);
}
