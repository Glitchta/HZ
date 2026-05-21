package com.study.hz.controller;

import com.study.hz.pojo.Message;
import com.study.hz.pojo.Result;
import com.study.hz.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @GetMapping("/get")
    public Result selectMessage() {
        return messageService.selectMessage();
    }

    @PostMapping("/send")
    public Result sendMessage(@RequestBody Message message) {
        Message saved = messageService.sendMessage(message);
        return Result.success(saved);
    }

    @GetMapping("/chat")
    public Result getChatMessages(@RequestParam("receiverId") Long receiverId,
                                  @RequestParam("current") int current,
                                  @RequestParam("size") int size) {
        List<Message> messages = messageService.getChatMessages(receiverId, current, size);
        return Result.success(messages);
    }

    @GetMapping("/unread/count")
    public Result countUnreadMessages(@RequestParam String userId) {
        int count = messageService.countUnreadMessages(userId);
        return Result.success(count);
    }

    @PostMapping("/mark-read")
    public Result markAsRead(@RequestParam String messageId) {
        messageService.markAsRead(messageId);
        return Result.success();
    }

    @PostMapping("/mark-all-read")
    public Result markAllAsRead(@RequestParam String userId, @RequestParam String otherUserId) {
        messageService.markAllAsRead(userId, otherUserId);
        return Result.success();
    }
}
