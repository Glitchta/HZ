package com.study.hz.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.study.hz.dto.MessageDto;
import com.study.hz.handler.WebSocketHandler;
import com.study.hz.mapper.MessageMapper;
import com.study.hz.pojo.Message;
import com.study.hz.pojo.Result;
import com.study.hz.service.MessageService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageMapper messageMapper;

    @Override
    public Result selectMessage(){
        Long id = ThreadLocalUtil.getUserId();
        List<MessageDto> messageDtos = messageMapper.selectMessage(id);
        return Result.success(messageDtos);
    }

    @Override
    public Message sendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setIsRead(0);
        message.setStatus("success");
        message.setSenderId(ThreadLocalUtil.getUserId());

        messageMapper.insert(message);

        // 通过WebSocket推送给接收方
        pushToReceiver(message);

        return message;
    }

    private void pushToReceiver(Message message) {
        try {
            com.alibaba.fastjson.JSONObject data = new com.alibaba.fastjson.JSONObject();
            data.put("type", "chat_message");

            com.alibaba.fastjson.JSONObject msgData = new com.alibaba.fastjson.JSONObject();
            msgData.put("id", String.valueOf(message.getId()));
            msgData.put("senderId", String.valueOf(message.getSenderId()));
            msgData.put("receiverId", String.valueOf(message.getReceiverId()));
            msgData.put("content", message.getContent());
            msgData.put("type", message.getType());
            msgData.put("timestamp", message.getTimestamp() != null ? message.getTimestamp().toString() : null);
            data.put("data", msgData);

            String receiverId = String.valueOf(message.getReceiverId());
            System.out.println("服务端主动推送消息给接收方: " + receiverId + ", 消息内容: " + message.getContent());
            WebSocketHandler.sendMessageToUser(receiverId, data.toJSONString());
        } catch (Exception e) {
            System.err.println("WebSocket推送失败: " + e.getMessage());
        }
    }

    @Override
    public List<Message> getChatMessages(Long receiverId, int page, int size) {
        int offset = (page - 1) * size;
        Long senderId = ThreadLocalUtil.getUserId();
        return messageMapper.getChatMessages(senderId,receiverId, offset, size);
    }

    @Override
    public int countUnreadMessages(String userId) {
        return messageMapper.countUnreadMessages(userId);
    }

    @Override
    public void markAsRead(String messageId) {
        UpdateWrapper<Message> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", messageId)
                .set("is_read", 1);
        messageMapper.update(null, wrapper);
    }

    @Override
    public void markAllAsRead(String userId, String otherUserId) {
        UpdateWrapper<Message> wrapper = new UpdateWrapper<>();
        wrapper.eq("receiver_id", userId)
                .eq("sender_id", otherUserId)
                .set("is_read", 1);
        messageMapper.update(null, wrapper);
    }
}
