package com.study.hz.admin.controller;

import com.study.hz.pojo.Announcement;
import com.study.hz.pojo.Result;
import com.study.hz.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/api")
public class AdminAnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @PostMapping("/announcement/create")
    public Result create(@RequestBody Announcement announcement) {
        return announcementService.create(announcement);
    }

    @GetMapping("/announcement/list")
    public Result list(@RequestParam(name = "current", defaultValue = "1") int current,
                       @RequestParam(name = "size", defaultValue = "10") int size) {
        return announcementService.list(current, size);
    }

    @DeleteMapping("/announcement/{id}")
    public Result delete(@PathVariable Long id) {
        return announcementService.delete(id);
    }
}
