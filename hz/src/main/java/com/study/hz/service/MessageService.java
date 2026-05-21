package com.study.hz.service;

import com.study.hz.pojo.Message;
import com.study.hz.pojo.Result;

import java.util.List;

public interface MessageService {
    Result selectMessage();
    Message sendMessage(Message message);
    List<Message> getChatMessages(Long receiverId, int current, int size);
    int countUnreadMessages(String userId);
    void markAsRead(String messageId);
    void markAllAsRead(String userId, String otherUserId);
}
