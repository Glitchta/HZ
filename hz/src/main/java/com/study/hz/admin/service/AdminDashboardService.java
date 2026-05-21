package com.study.hz.admin.service;

import com.study.hz.admin.dto.DashboardStatsDto;
import com.study.hz.pojo.Result;

public interface AdminDashboardService {
    Result<DashboardStatsDto> getStats();
}
