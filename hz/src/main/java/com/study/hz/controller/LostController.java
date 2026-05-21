package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Lost;
import com.study.hz.pojo.Result;
import com.study.hz.service.LostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lost")
public class LostController {

    @Autowired
    LostService lostService;

    @PostMapping("/list")
    public Result selectLostList(@RequestBody PageDto pageDto){
        return lostService.selectLostList(pageDto);
    }
    @PostMapping("/insert")
    public Result insertLost(@RequestBody Lost lost){
        return lostService.insertLost(lost);
    }
    @GetMapping("/getById")
    public Result selectLostById(@RequestParam("id") Long id){
        return lostService.selectLostById(id);
    }
    @PutMapping("/comment")
    public Result updateComment(@RequestParam("id") Long id){
        return lostService.updateComment(id);
    }
}
