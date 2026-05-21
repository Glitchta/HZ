package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Lost;
import com.study.hz.pojo.Result;

public interface LostService extends IService<Lost> {
    Result selectLostList (PageDto pageDto);
    Result insertLost(Lost lost);
    Result selectLostById (Long id);
    Result updateComment(Long id);
}
