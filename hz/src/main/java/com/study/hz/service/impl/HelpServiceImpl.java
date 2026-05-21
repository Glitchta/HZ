package com.study.hz.service.impl;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.HelpDto;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.HelpMapper;
import com.study.hz.pojo.Help;
import com.study.hz.pojo.Result;
import com.study.hz.service.HelpService;
import com.study.hz.util.ThreadLocalUtil;
import lombok.Data;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HelpServiceImpl extends ServiceImpl<HelpMapper,Help> implements HelpService {
    @Autowired
    HelpMapper helpMapper;


    @Override
    public Result createResort(Help help) {

        //组合数据

        help.setCreateUser(ThreadLocalUtil.getUserId());
        help.setType("求助");
        help.setStatus("待帮助");
        help.setCreateTime(LocalDateTime.now());
        System.out.println(help);

        if (helpMapper.insert(help) == 1) {
            return Result.success();
        }
        return Result.error();
    }

    @Override
    public Result createHelp(Help help) {

        //组合数据

        help.setCreateUser(ThreadLocalUtil.getUserId());
        help.setType("帮忙");
        help.setStatus("进行中");
        help.setCreateTime(LocalDateTime.now());
        System.out.println(help);

        if (helpMapper.insert(help) == 1) {
            return Result.success();
        }
        return Result.error();
    }

    @Override
    public Result listHelp(PageDto pageDto) {

        Integer offset = (pageDto.getCurrent()-1)*pageDto.getSize();
        List<HelpDto> helps = helpMapper.selectHelpList(offset,pageDto.getSize());

        if (helps.size() > 0) {
            return Result.success(helps);
        }
        return Result.success("已经到底了",null) ;
    }

    @Override
    public Result detailHelp(Long id) {
        HelpDto helpDto = helpMapper.selectDetailById(id);
        return Result.success(helpDto);
    }

    @Override
    public Result getUserHelpCount() {
        Long userId = ThreadLocalUtil.getUserId();
        int resortCount = helpMapper.countByUserIdAndType(userId, "求助");
        int helpCount = helpMapper.countByUserIdAndType(userId, "帮忙");
        Map<String, Integer> counts = new HashMap<>();
        counts.put("resortCount", resortCount);
        counts.put("helpCount", helpCount);
        return Result.success(counts);
    }

    @Override
    public Result updateComment(Long id) {
        helpMapper.incrementCommentCount(id);
        return Result.success();
    }

    @Override
    public Result updateStatus(Long id, String status, Long userId) {
        Help help = super.getById(id);
        if (help == null) {
            return Result.error("发布不存在");
        }
        if (!help.getCreateUser().equals(userId)) {
            return Result.error("无权操作");
        }
        helpMapper.updateStatus(id, status);
        return Result.success();
    }
}
