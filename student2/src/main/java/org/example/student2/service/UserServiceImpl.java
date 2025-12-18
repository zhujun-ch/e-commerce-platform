package org.example.student2.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.student2.entity.User;
import org.example.student2.mapper.UserMapper;
import org.example.student2.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User login(String username, String password) {
        // 对密码进行MD5加密处理
        String md5Password = DigestUtils.md5DigestAsHex(password.getBytes());

        // 构造查询条件
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username).eq("password", md5Password);

        // 查询用户
        return this.getOne(queryWrapper);
    }

    public User findByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return this.getOne(queryWrapper);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        String md5Password = DigestUtils.md5DigestAsHex(rawPassword.getBytes());
        return md5Password.equals(encodedPassword);
    }
}