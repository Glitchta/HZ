package com.study.hz.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.*;
import com.study.hz.mapper.*;
import com.study.hz.pojo.*;
import com.study.hz.service.LikeService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LikeServiceImpl extends ServiceImpl<LikeMapper, Like> implements LikeService {

    @Autowired
    private LikeMapper likeMapper;
    @Autowired
    private HoleMapper holeMapper;
    @Autowired
    private LostMapper lostMapper;
    @Autowired
    private DynamicMapper dynamicMapper;

    @Override
    public Result addLike(Long contentId, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        Like existing = likeMapper.selectByUserAndContent(userId, contentId, contentType);
        if (existing != null) {
            return Result.error("已点赞");
        }
        Like l = new Like();
        l.setUserId(userId);
        l.setContentId(contentId);
        l.setContentType(contentType);
        l.setCreateTime(LocalDateTime.now());
        likeMapper.insert(l);

        incrementLikeCount(contentId, contentType, 1);
        return Result.success();
    }

    @Override
    public Result cancelLike(Long contentId, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        Like existing = likeMapper.selectByUserAndContent(userId, contentId, contentType);
        if (existing == null) {
            return Result.error("未点赞");
        }
        likeMapper.deleteById(existing.getId());

        incrementLikeCount(contentId, contentType, -1);
        return Result.success();
    }

    @Override
    public Result checkLike(Long contentId, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        Like existing = likeMapper.selectByUserAndContent(userId, contentId, contentType);
        return Result.success(existing != null);
    }

    @Override
    public Result getLikeList(PageDto pageDto, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        int offset = (pageDto.getCurrent() - 1) * pageDto.getSize();
        int size = pageDto.getSize();

        List<Like> likes = likeMapper.selectByUserIdAndType(
                userId, contentType.isEmpty() ? null : contentType, offset, size);

        List<MyPostDto> result = new ArrayList<>();
        for (Like l : likes) {
            MyPostDto dto = fetchContentById(l.getContentId(), l.getContentType());
            if (dto != null) result.add(dto);
        }
        return Result.success(result);
    }

    private void incrementLikeCount(Long contentId, String contentType, int delta) {
        switch (contentType) {
            case "hole": {
                Hole item = holeMapper.selectById(contentId);
                if (item != null) {
                    item.setLikeCount(Math.max(0, item.getLikeCount() + delta));
                    holeMapper.updateById(item);
                }
                break;
            }
            case "lost": {
                Lost item = lostMapper.selectById(contentId);
                if (item != null) {
                    item.setLikeCount(Math.max(0, item.getLikeCount() + delta));
                    lostMapper.updateById(item);
                }
                break;
            }
            case "alumni": {
                Dynamic item = dynamicMapper.selectById(contentId);
                if (item != null) {
                    item.setLikeCount(Math.max(0, item.getLikeCount() + delta));
                    dynamicMapper.updateById(item);
                }
                break;
            }
        }
    }

    private MyPostDto fetchContentById(Long contentId, String contentType) {
        switch (contentType) {
            case "hole": {
                Hole item = holeMapper.selectById(contentId);
                if (item == null) return null;
                MyPostDto dto = new MyPostDto();
                dto.setId(item.getId());
                dto.setType("hole");
                dto.setContent(item.getContent());
                dto.setImages(item.getImages());
                dto.setCommentCount(item.getCommentCount());
                dto.setLikeCount(item.getLikeCount());
                dto.setViewCount(0);
                dto.setCreateTime(item.getCreateTime());
                return dto;
            }
            case "lost": {
                LostDto item = lostMapper.selectLostById(contentId);
                if (item == null) return null;
                MyPostDto dto = new MyPostDto();
                dto.setId(item.getId());
                dto.setType("lost");
                dto.setContent(item.getDescription());
                dto.setImages(item.getImages());
                dto.setCommentCount(item.getCommentCount());
                dto.setLikeCount(item.getLikeCount());
                dto.setViewCount(0);
                dto.setCreateTime(item.getCreateTime());
                return dto;
            }
            case "alumni": {
                DynamicDto item = dynamicMapper.selectDynamicById(contentId);
                if (item == null) return null;
                MyPostDto dto = new MyPostDto();
                dto.setId(item.getId());
                dto.setType("alumni");
                dto.setTitle(item.getTitle());
                dto.setContent(item.getContent());
                dto.setImages(item.getImages());
                dto.setCommentCount(item.getCommentCount());
                dto.setLikeCount(item.getLikeCount());
                dto.setViewCount(0);
                dto.setCreateTime(item.getCreateTime());
                return dto;
            }
        }
        return null;
    }
}
