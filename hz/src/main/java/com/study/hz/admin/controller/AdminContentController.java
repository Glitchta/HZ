package com.study.hz.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.study.hz.admin.mapper.AdminDashboardMapper;
import com.study.hz.mapper.LikeMapper;
import com.study.hz.pojo.Result;
import com.study.hz.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/admin/api")
public class AdminContentController {

    private static final List<String> ALL_TYPES = Arrays.asList("help_ask", "help_offer", "hole", "lost", "dynamic");

    @Autowired
    private AdminDashboardMapper adminDashboardMapper;

    @Autowired
    private HelpService helpService;

    @Autowired
    private HoleService holeService;

    @Autowired
    private LostService lostService;

    @Autowired
    private DynamicService dynamicService;

    @Autowired
    private CollectionService collectionService;

    @Autowired
    private LikeMapper likeMapper;

    @GetMapping("/content/list")
    public Result getContentList(@RequestParam(name = "current", defaultValue = "1") int current,
                                  @RequestParam(name = "size", defaultValue = "10") int size,
                                  @RequestParam(name = "type", required = false) String type,
                                  @RequestParam(name = "keyword", required = false) String keyword) {
        int offset = (current - 1) * size;
        List<String> typeList = (type == null || type.isEmpty()) ? ALL_TYPES : Arrays.asList(type);
        return Result.success(adminDashboardMapper.selectContentList(typeList, keyword, offset, size));
    }

    @GetMapping("/content/{contentType}/{id}")
    public Result getContentDetail(@PathVariable String contentType, @PathVariable Long id) {
        switch (contentType.toLowerCase()) {
            case "help_ask":
            case "help_offer":
                return helpService.detailHelp(id);
            case "hole":
                return holeService.getById(id);
            case "lost":
                return lostService.selectLostById(id);
            case "dynamic":
                return dynamicService.getById(id);
            default:
                return Result.error("不支持的内容类型: " + contentType);
        }
    }

    @DeleteMapping("/content/{contentType}/{id}")
    public Result deleteContent(@PathVariable String contentType, @PathVariable Long id) {
        // 1. 删除关联的点赞
        QueryWrapper<com.study.hz.pojo.Like> likeWrapper = new QueryWrapper<>();
        likeWrapper.eq("content_id", id).eq("content_type", contentType);
        likeMapper.delete(likeWrapper);

        // 2. 删除关联的收藏
        QueryWrapper<com.study.hz.pojo.Collection> collectWrapper = new QueryWrapper<>();
        collectWrapper.eq("content_id", id).eq("content_type", contentType);
        collectionService.remove(collectWrapper);

        // 3. 删除内容本身
        boolean removed = false;
        switch (contentType.toLowerCase()) {
            case "help_ask":
            case "help_offer":
                removed = helpService.removeById(id);
                break;
            case "hole":
                removed = holeService.removeById(id);
                break;
            case "lost":
                removed = lostService.removeById(id);
                break;
            case "dynamic":
                removed = dynamicService.removeById(id);
                break;
            default:
                return Result.error("不支持的内容类型: " + contentType);
        }
        return removed ? Result.success() : Result.error("删除失败");
    }
}
