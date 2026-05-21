package com.study.hz.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.DynamicDto;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.DynamicMapper;
import com.study.hz.pojo.Dynamic;
import com.study.hz.pojo.Result;
import com.study.hz.service.DynamicService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DynamicServiceImpl extends ServiceImpl<DynamicMapper, Dynamic> implements DynamicService {
    @Autowired
    private DynamicMapper dynamicMapper;

    @Override
    public Result selectDynamicList(PageDto pageDto) {
        int offset = (pageDto.getCurrent() - 1) * pageDto.getSize();
        List<DynamicDto> dynamicDtos = dynamicMapper.selectDynamicList(offset, pageDto.getSize());
        return Result.success(dynamicDtos);
    }

    @Override
    public Result insertDynamic(Dynamic dynamic) {
        dynamic.setCreateUser(ThreadLocalUtil.getUserId());
        dynamic.setCommentCount(0);
        dynamic.setLikeCount(0);
        dynamic.setCreateTime(LocalDateTime.now());

        dynamicMapper.insert(dynamic);
        return Result.success();
    }

    @Override
    public Result getById(Long id) {
        return Result.success(dynamicMapper.selectDynamicById(id));
    }

    @Override
    public Result toggleLike(Long dynamicId, Boolean isLike) {
        Dynamic dynamic = dynamicMapper.selectById(dynamicId);
        if (dynamic == null) return Result.error("动态不存在");
        if (isLike) {
            dynamic.setLikeCount(dynamic.getLikeCount() + 1);
        } else {
            dynamic.setLikeCount(Math.max(0, dynamic.getLikeCount() - 1));
        }
        dynamicMapper.updateById(dynamic);
        return Result.success();
    }

    @Override
    public Result updateComment(Long id) {
        Dynamic dynamic = dynamicMapper.selectById(id);
        if (dynamic == null) return Result.error("内容不存在");
        dynamic.setCommentCount(dynamic.getCommentCount() + 1);
        dynamicMapper.updateById(dynamic);
        return Result.success();
    }
}
