package com.study.hz.admin.mapper;

import com.study.hz.admin.dto.AdminContentVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminDashboardMapper {

    Long countUsers();

    Long countHelps();

    Long countHoles();

    Long countLosts();

    Long countDynamics();

    Long countComments();

    Long countLikes();

    Long countCollections();

    List<AdminContentVo> selectContentList(@Param("typeList") List<String> typeList,
                                           @Param("keyword") String keyword,
                                           @Param("offset") int offset,
                                           @Param("size") int size);
}
