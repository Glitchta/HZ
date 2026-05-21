package com.study.hz.admin.controller;

import com.study.hz.admin.service.AdminDashboardService;
import com.study.hz.pojo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/api")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard/stats")
    public Result getStats() {
        return adminDashboardService.getStats();
    }
}
