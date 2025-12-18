package org.example.student2.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.student2.entity.User;

public interface UserService extends IService<User> {
    User login(String username, String password);
}