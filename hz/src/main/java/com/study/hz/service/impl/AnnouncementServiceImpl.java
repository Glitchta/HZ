package com.study.hz.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.mapper.AnnouncementMapper;
import com.study.hz.pojo.Announcement;
import com.study.hz.pojo.Result;
import com.study.hz.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AnnouncementServiceImpl extends ServiceImpl<AnnouncementMapper, Announcement> implements AnnouncementService {

    @Autowired
    private AnnouncementMapper announcementMapper;

    @Override
    public Result create(Announcement announcement) {
        announcement.setCreateTime(LocalDateTime.now());
        announcementMapper.insert(announcement);
        return Result.success();
    }

    @Override
    public Result getLatest() {
        QueryWrapper<Announcement> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("create_time").last("limit 1");
        Announcement a = announcementMapper.selectOne(wrapper);
        return Result.success(a);
    }

    @Override
    public Result list(int current, int size) {
        QueryWrapper<Announcement> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("create_time");
        Page<Announcement> page = new Page<>(current, size);
        return Result.success(announcementMapper.selectPage(page, wrapper));
    }

    @Override
    public Result delete(Long id) {
        announcementMapper.deleteById(id);
        return Result.success();
    }
}
