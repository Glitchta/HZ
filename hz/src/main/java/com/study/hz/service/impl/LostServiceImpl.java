package com.study.hz.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.LostDto;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.LostMapper;
import com.study.hz.pojo.Lost;
import com.study.hz.pojo.Result;
import com.study.hz.service.LostService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class LostServiceImpl extends ServiceImpl<LostMapper, Lost> implements LostService {
    @Autowired
    LostMapper lostMapper;

    @Override
    public Result selectLostList(PageDto pageDto) {
        int offset = (pageDto.getCurrent() - 1) * pageDto.getSize();
        List<LostDto> losts = lostMapper.selectLostList(offset, pageDto.getSize());
        return Result.success(losts);
    }

    @Override
    public Result insertLost(Lost lost) {
        lost.setCreateUser(ThreadLocalUtil.getUserId());
        lost.setCreateTime(LocalDateTime.now());
        lost.setCommentCount(0);
        lost.setLikeCount(0);

        lostMapper.insert(lost);
        return Result.success();
    }

    @Override
    public Result selectLostById(Long id) {
        LostDto lostDto = lostMapper.selectLostById(id);
        return Result.success(lostDto);
    }

    @Override
    public Result updateComment(Long id) {
        Lost lost = lostMapper.selectById(id);
        if (lost == null) return Result.error("内容不存在");
        lost.setCommentCount(lost.getCommentCount() + 1);
        lostMapper.updateById(lost);
        return Result.success();
    }
}
