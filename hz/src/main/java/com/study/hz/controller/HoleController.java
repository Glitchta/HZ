package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Comment;
import com.study.hz.pojo.Hole;
import com.study.hz.pojo.Result;
import com.study.hz.service.HoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hole")
public class HoleController {
    @Autowired
    HoleService holeService;

    @PostMapping("/list")
    public Result getHoleList(@RequestBody PageDto pageDto) {
        return holeService.getHoleList(pageDto);
    }
    @GetMapping("/getById")
    public Result getById(@RequestParam("id") Long id) {
        return  holeService.getById(id);
    }
    @PostMapping("/insert")
    public Result insertHole(@RequestBody Hole hole){
        return holeService.insert(hole);
    }
    @PutMapping("/comment")
    public Result updateComment(@RequestParam("id") Long id){
        return holeService.updateComment(id);
    }


}
