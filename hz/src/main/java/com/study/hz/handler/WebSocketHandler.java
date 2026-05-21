package com.study.hz.handler;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class WebSocketHandler extends TextWebSocketHandler {
    private static final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            sessions.put(userId, session);
            System.out.println("WebSocket连接建立: " + userId);
        }
    }
@Override
protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    try {
        String payload = message.getPayload();
        if (payload == null || payload.isEmpty() || "undefined".equals(payload)) {
            return;
        }
        if (!payload.startsWith("{") && !payload.startsWith("[")) {
            System.out.println("WebSocket接收到非JSON消息(payload): " + payload);
            return;
        }
        JSONObject data = JSON.parseObject(payload);
        String type = data.getString("type");

        switch (type) {
            case "auth":
                handleAuth(session, data);
                break;
            case "chat_message":
                handleChatMessage(session, data);
                break;
            case "typing":
                handleTyping(data);
                break;
            case "read_receipt":
                handleReadReceipt(data);
                break;
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            sessions.remove(userId);
            System.out.println("WebSocket连接关闭: " + userId);
        }
    }

    private String getUserIdFromSession(WebSocketSession session) {
        return (String) session.getAttributes().get("userId");
    }

    private void handleAuth(WebSocketSession session, JSONObject data) {
        String userId = data.getString("userId");
        if (userId != null) {
            session.getAttributes().put("userId", userId);
            sessions.put(userId, session);
            System.out.println("用户认证成功: " + userId);
        }
    }

    private void handleChatMessage(WebSocketSession session, JSONObject data) {
        JSONObject message = data.getJSONObject("data");
        // 从session获取发送者ID补充到消息中
        String senderId = (String) session.getAttributes().get("userId");
        if (senderId != null && !message.containsKey("senderId")) {
            message.put("senderId", senderId);
        }
        String receiverId = message.getString("receiverId");
        System.out.println("WebSocket转发消息: senderId=" + senderId + ", receiverId=" + receiverId);
        WebSocketSession receiverSession = sessions.get(receiverId);

        if (receiverSession != null && receiverSession.isOpen()) {
            try {
                receiverSession.sendMessage(new TextMessage(data.toJSONString()));
                System.out.println("消息已推送给接收方: " + receiverId);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("接收方WebSocket未连接或已断开: " + receiverId + ", 当前连接数=" + sessions.size());
        }
    }

    private void handleTyping(JSONObject data) {
        String receiverId = data.getString("receiverId");
        WebSocketSession receiverSession = sessions.get(receiverId);

        if (receiverSession != null && receiverSession.isOpen()) {
            try {
                receiverSession.sendMessage(new TextMessage(data.toJSONString()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void handleReadReceipt(JSONObject data) {
        String receiverId = data.getString("chatId");
        WebSocketSession receiverSession = sessions.get(receiverId);

        if (receiverSession != null && receiverSession.isOpen()) {
            try {
                receiverSession.sendMessage(new TextMessage(data.toJSONString()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void sendMessageToUser(String userId, String message) {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
