package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Help;
import com.study.hz.pojo.Result;

public interface HelpService extends IService<Help> {
    Result createResort(Help help);
    Result createHelp(Help help);
    Result listHelp (PageDto pageDto);
    Result detailHelp (Long id);
    Result getUserHelpCount();
    Result updateComment(Long id);
    Result updateStatus(Long id, String status, Long userId);
}
