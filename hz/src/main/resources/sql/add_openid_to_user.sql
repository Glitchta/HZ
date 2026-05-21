-- 为user表添加openid字段，用于微信登录
ALTER TABLE user ADD COLUMN openid VARCHAR(64) DEFAULT NULL COMMENT '微信openid';
CREATE UNIQUE INDEX idx_user_openid ON user(openid);
