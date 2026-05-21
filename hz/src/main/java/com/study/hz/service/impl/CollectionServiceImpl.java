package com.study.hz.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.*;
import com.study.hz.mapper.*;
import com.study.hz.pojo.*;
import com.study.hz.service.CollectionService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionServiceImpl extends ServiceImpl<CollectionMapper, Collection> implements CollectionService {

    @Autowired
    private CollectionMapper collectionMapper;
    @Autowired
    private HelpMapper helpMapper;
    @Autowired
    private LostMapper lostMapper;
    @Autowired
    private HoleMapper holeMapper;
    @Autowired
    private DynamicMapper dynamicMapper;

    @Override
    public Result addCollection(Long contentId, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        Collection existing = collectionMapper.selectByUserAndContent(userId, contentId, contentType);
        if (existing != null) {
            return Result.error("已收藏");
        }
        Collection c = new Collection();
        c.setUserId(userId);
        c.setContentId(contentId);
        c.setContentType(contentType);
        c.setCreateTime(LocalDateTime.now());
        collectionMapper.insert(c);
        return Result.success();
    }

    @Override
    public Result cancelCollection(Long contentId, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        Collection existing = collectionMapper.selectByUserAndContent(userId, contentId, contentType);
        if (existing == null) {
            return Result.error("未收藏");
        }
        collectionMapper.deleteById(existing.getId());
        return Result.success();
    }

    @Override
    public Result checkCollection(Long contentId, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        Collection existing = collectionMapper.selectByUserAndContent(userId, contentId, contentType);
        return Result.success(existing != null);
    }

    @Override
    public Result getCollectionList(PageDto pageDto, String contentType) {
        Long userId = ThreadLocalUtil.getUserId();
        int offset = (pageDto.getCurrent() - 1) * pageDto.getSize();
        int size = pageDto.getSize();

        List<Collection> collections = collectionMapper.selectByUserIdAndType(
                userId, contentType.isEmpty() ? null : contentType, offset, size);

        List<MyPostDto> result = new ArrayList<>();
        for (Collection c : collections) {
            MyPostDto dto = fetchContentById(c.getContentId(), c.getContentType());
            if (dto != null) result.add(dto);
        }
        return Result.success(result);
    }

    private MyPostDto fetchContentById(Long contentId, String contentType) {
        switch (contentType) {
            case "help": {
                HelpDto item = helpMapper.selectDetailById(contentId);
                if (item == null) return null;
                MyPostDto dto = new MyPostDto();
                dto.setId(item.getId());
                dto.setType("help");
                dto.setTitle(item.getTitle());
                dto.setContent(item.getDescription());
                dto.setImages(item.getImages());
                dto.setCommentCount(0);
                dto.setLikeCount(0);
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
                dto.setTitle(null);
                dto.setContent(item.getDescription());
                dto.setImages(item.getImages());
                dto.setCommentCount(item.getCommentCount());
                dto.setLikeCount(item.getLikeCount());
                dto.setViewCount(0);
                dto.setCreateTime(item.getCreateTime());
                return dto;
            }
            case "hole": {
                Hole item = holeMapper.selectById(contentId);
                if (item == null) return null;
                MyPostDto dto = new MyPostDto();
                dto.setId(item.getId());
                dto.setType("hole");
                dto.setTitle(null);
                dto.setContent(item.getContent());
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
