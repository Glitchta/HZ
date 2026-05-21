package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.dto.MessageDto;
import com.study.hz.pojo.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {
    List<MessageDto> selectMessage(@Param("id") Long id);
    List<Message> getChatMessages(@Param("senderId") Long senderId,
                                  @Param("receiverId") Long receiverId,
                                  @Param("offset") int offset,@Param("size") int size);
    int countUnreadMessages(String receiverId);
}
