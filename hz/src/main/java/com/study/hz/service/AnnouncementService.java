package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.pojo.Announcement;
import com.study.hz.pojo.Result;

public interface AnnouncementService extends IService<Announcement> {
    Result create(Announcement announcement);
    Result getLatest();
    Result list(int current, int size);
    Result delete(Long id);
}
