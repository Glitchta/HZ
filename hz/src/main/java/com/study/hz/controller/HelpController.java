package com.study.hz.controller;

import com.study.hz.dto.HelpDto;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Help;
import com.study.hz.pojo.Result;
import com.study.hz.service.HelpService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/help")
public class HelpController {
    @Autowired
    HelpService helpService;
    @PostMapping("/resort")
    public Result createResort (@RequestBody Help help) {
        return helpService.createResort(help);
    }
    @PostMapping("/help")
    public Result createHelp (@RequestBody Help help) {
        return helpService.createHelp(help);
    }
    @PostMapping ("/list")
    public Result listHelp (@RequestBody PageDto pageDto) {
        return helpService.listHelp(pageDto);
    }
    @GetMapping("/detail")
    public Result detailHelp (@RequestParam("id") Long id) {
        return helpService.detailHelp(id);
    }
    @GetMapping("/count")
    public Result getUserHelpCount() {
        return helpService.getUserHelpCount();
    }
    @PutMapping("/comment")
    public Result updateComment(@RequestParam("id") Long id){
        return helpService.updateComment(id);
    }
    @PutMapping("/status")
    public Result updateStatus(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        String status = params.get("status").toString();
        Long userId = ThreadLocalUtil.getUserId();
        return helpService.updateStatus(id, status, userId);
    }
}
