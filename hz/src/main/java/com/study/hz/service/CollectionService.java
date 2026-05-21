package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Collection;
import com.study.hz.pojo.Result;

public interface CollectionService extends IService<Collection> {
    Result addCollection(Long contentId, String contentType);
    Result cancelCollection(Long contentId, String contentType);
    Result checkCollection(Long contentId, String contentType);
    Result getCollectionList(PageDto pageDto, String contentType);
}
