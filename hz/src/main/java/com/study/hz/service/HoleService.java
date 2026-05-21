package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Hole;
import com.study.hz.pojo.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public interface HoleService extends IService<Hole> {
    Result getHoleList(PageDto pageDto);
    Result getById(@RequestParam("id") Long id);
    Result insert(Hole hole);
    Result updateComment (Long id);
}
