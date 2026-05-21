package com.study.hz.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.HoleMapper;
import com.study.hz.pojo.Hole;
import com.study.hz.pojo.Result;
import com.study.hz.service.HoleService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HoleServiceImpl extends ServiceImpl<HoleMapper, Hole> implements HoleService {
    @Autowired
    HoleMapper holeMapper;

    @Override
    public Result getHoleList(PageDto pageDto) {
        int offset = (pageDto.getCurrent()-1)*pageDto.getSize();
        List<Hole> holeList = holeMapper.getHoleList(offset, pageDto.getSize());
        return Result.success(holeList);
    }

    @Override
    public Result getById(Long id) {
        return Result.success(holeMapper.selectById(id));
    }

    @Override
    public Result insert(Hole hole) {
        hole.setCreateTime(LocalDateTime.now());
        hole.setCreateUser(ThreadLocalUtil.getUserId());
        hole.setCommentCount(0);
        hole.setLikeCount(0);

        holeMapper.insert(hole);
        return Result.success();
    }

    @Override
    public Result updateComment(Long id) {
        Hole hole = holeMapper.selectById(id);
        hole.setCommentCount(hole.getCommentCount()+1);
        holeMapper.updateById(hole);
        return Result.success();
    }
}
