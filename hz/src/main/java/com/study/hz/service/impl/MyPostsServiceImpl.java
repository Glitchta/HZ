package com.study.hz.service.impl;

import com.study.hz.dto.MyPostDto;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.*;
import com.study.hz.pojo.Result;
import com.study.hz.service.MyPostsService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyPostsServiceImpl implements MyPostsService {

    @Autowired
    private MyPostMapper myPostMapper;
    @Autowired
    private HoleMapper holeMapper;
    @Autowired
    private LostMapper lostMapper;
    @Autowired
    private HelpMapper helpMapper;
    @Autowired
    private DynamicMapper dynamicMapper;

    @Override
    public Result getMyPostList(PageDto pageDto, String type) {
        Long userId = ThreadLocalUtil.getUserId();
        int offset = (pageDto.getCurrent() - 1) * pageDto.getSize();
        int size = pageDto.getSize();

        List<MyPostDto> list;
        switch (type == null ? "" : type) {
            case "help":
                list = myPostMapper.selectHelpByUserId(userId, offset, size);
                break;
            case "helped":
                list = myPostMapper.selectHelpedByUserId(userId, offset, size);
                break;
            case "lost":
                list = myPostMapper.selectLostByUserId(userId, offset, size);
                break;
            case "hole":
                list = myPostMapper.selectHoleByUserId(userId, offset, size);
                break;
            case "alumni":
                list = myPostMapper.selectAlumniByUserId(userId, offset, size);
                break;
            default:
                list = myPostMapper.selectAllByUserId(userId, offset, size);
                break;
        }
        return Result.success(list);
    }

    @Override
    public Result deleteMyPost(Long id, String type) {
        boolean deleted;
        switch (type == null ? "" : type) {
            case "help":
            case "helped":
                deleted = helpMapper.deleteById(id) > 0;
                break;
            case "lost":
                deleted = lostMapper.deleteById(id) > 0;
                break;
            case "hole":
                deleted = holeMapper.deleteById(id) > 0;
                break;
            case "alumni":
                deleted = dynamicMapper.deleteById(id) > 0;
                break;
            default:
                return Result.error("未知的发布类型");
        }
        if (deleted) {
            return Result.success();
        }
        return Result.error("删除失败，发布不存在");
    }
}
