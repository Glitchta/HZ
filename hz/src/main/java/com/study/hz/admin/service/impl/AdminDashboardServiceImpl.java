package com.study.hz.admin.service.impl;

import com.study.hz.admin.dto.DashboardStatsDto;
import com.study.hz.admin.mapper.AdminDashboardMapper;
import com.study.hz.admin.service.AdminDashboardService;
import com.study.hz.pojo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private AdminDashboardMapper adminDashboardMapper;

    @Override
    public Result<DashboardStatsDto> getStats() {
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalUsers(adminDashboardMapper.countUsers());
        dto.setTotalHelps(adminDashboardMapper.countHelps());
        dto.setTotalHelpOffers(adminDashboardMapper.countHelpOffers());
        dto.setTotalHoles(adminDashboardMapper.countHoles());
        dto.setTotalLosts(adminDashboardMapper.countLosts());
        dto.setTotalDynamics(adminDashboardMapper.countDynamics());
        dto.setTotalComments(adminDashboardMapper.countComments());
        dto.setTotalLikes(adminDashboardMapper.countLikes());
        dto.setTotalCollections(adminDashboardMapper.countCollections());
        return Result.success(dto);
    }
}
