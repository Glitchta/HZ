package com.study.hz.controller;

import com.study.hz.pojo.Result;
import com.study.hz.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcement")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping("/latest")
    public Result getLatest() {
        return announcementService.getLatest();
    }

    @GetMapping("/list")
    public Result list(@RequestParam(name = "current", defaultValue = "1") int current,
                       @RequestParam(name = "size", defaultValue = "50") int size) {
        return announcementService.list(current, size);
    }
}
