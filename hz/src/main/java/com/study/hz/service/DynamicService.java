package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Dynamic;
import com.study.hz.pojo.Result;

public interface DynamicService extends IService<Dynamic> {
    Result selectDynamicList(PageDto pageDto);
    Result insertDynamic(Dynamic dynamic);
    Result getById(Long id);
    Result toggleLike(Long dynamicId, Boolean isLike);
    Result updateComment(Long id);
}
