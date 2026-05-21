package com.study.hz.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.LoginDto;
import com.study.hz.dto.WxLoginDto;
import com.study.hz.mapper.UserInfoMapper;
import com.study.hz.mapper.UserMapper;
import com.study.hz.pojo.Result;
import com.study.hz.pojo.User;
import com.study.hz.pojo.UserInfo;
import com.study.hz.service.UserService;
import com.study.hz.util.JwtUtil;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;


@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserInfoMapper userInfoMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RestTemplate restTemplate;

    @Value("${wechat.app-id}")
    private String wechatAppId;

    @Value("${wechat.app-secret}")
    private String wechatAppSecret;

    @Override
    public Result<User> register(LoginDto loginDto) {
        String username = loginDto.getUsername();
        if(this.userMapper.selectByUsername(username)!=null){
            return Result.error("用户名已经存在");
        }
        User user = new User();
        user.setUsername(username);
        if(loginDto.getPassword().length()<6 || loginDto.getConfirmPassword().length()<6){
            return Result.error("密码不合法");
        }
        if(!loginDto.getPassword().equals(loginDto.getConfirmPassword())){
            return Result.error("两次密码不一致");
        }
        user.setPassword(passwordEncoder.encode(loginDto.getPassword()));
        userMapper.insert(user);
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(userMapper.selectByUsername(user.getUsername()).getId());
        userInfoMapper.insert(userInfo);
        return Result.success();
    }

    @Override
    public Result<User> login(LoginDto loginDto) {
        String username = loginDto.getUsername();
        if(loginDto.getUsername()==null){
            return Result.error("用户名不能为空");
        }
        User originUser = this.userMapper.selectByUsername(username);
        if(originUser == null){
            return Result.error("用户名或密码错误");
        }
        if(!passwordEncoder.matches(loginDto.getPassword(),originUser.getPassword())){
            return Result.error("用户名或密码错误");
        }
        //生成双令牌返回前端
        Long userId = this.selectByUsername(username).getId();
        loginDto.setAccessToken(jwtUtil.generateAccessToken(userId));
        loginDto.setRefreshToken(jwtUtil.generateRefreshToken(userId));

        return Result.success(loginDto);
    }

    @Override
    public Result<User> wxLogin(WxLoginDto wxLoginDto) {
        String code = wxLoginDto.getCode();
        if (code == null || code.isEmpty()) {
            return Result.error("code不能为空");
        }

        // 1. 调用微信接口换取openid
        String url = "https://api.weixin.qq.com/sns/jscode2session"
                + "?appid=" + wechatAppId
                + "&secret=" + wechatAppSecret
                + "&js_code=" + code
                + "&grant_type=authorization_code";

        String response;
        try {
            response = restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            return Result.error("微信登录失败：无法连接微信服务器");
        }

        JSONObject json = JSONObject.parseObject(response);
        if (json.containsKey("errcode") && json.getInteger("errcode") != 0) {
            return Result.error("微信登录失败：" + json.getString("errmsg"));
        }

        String openid = json.getString("openid");

        // 2. 根据openid查找用户，找不到则创建新用户
        User user = userMapper.selectByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setUsername("wx_" + UUID.randomUUID().toString().substring(0, 8));
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setOpenid(openid);
            userMapper.insert(user);

            UserInfo userInfo = new UserInfo();
            userInfo.setUserId(user.getId());
            userInfoMapper.insert(userInfo);
        }

        // 3. 生成双令牌
        Long userId = user.getId();
        LoginDto loginDto = new LoginDto();
        loginDto.setId(userId);
        loginDto.setUsername(user.getUsername());
        loginDto.setAccessToken(jwtUtil.generateAccessToken(userId));
        loginDto.setRefreshToken(jwtUtil.generateRefreshToken(userId));

        return Result.success(loginDto);
    }

    @Override
    public User selectById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public User selectByUsername(String username) {
        return  userMapper.selectByUsername(username);
    }

}
