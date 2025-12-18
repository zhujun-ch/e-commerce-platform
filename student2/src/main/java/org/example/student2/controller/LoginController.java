package org.example.student2.controller;

import org.example.student2.entity.User;
import org.example.student2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class LoginController {

    @Autowired
    private UserService userService;

    /**
     * 管理员登录接口
     * @param loginRequest 登录请求参数
     * @param session HTTP会话
     * @return 登录结果
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // 参数校验
            if (username == null || username.trim().isEmpty()) {
                result.put("code", 400);
                result.put("message", "用户名不能为空");
                return result;
            }

            if (password == null || password.trim().isEmpty()) {
                result.put("code", 400);
                result.put("message", "密码不能为空");
                return result;
            }

            // 用户认证
            User user = userService.login(username, password);

            if (user != null) {
                // 检查是否为管理员角色
                if ("admin".equals(user.getRole())) {
                    // 登录成功，将用户信息存储到session中
                    session.setAttribute("currentUser", user);

                    result.put("code", 200);
                    result.put("message", "登录成功");
                    result.put("data", user);
                } else {
                    result.put("code", 403);
                    result.put("message", "权限不足，仅管理员可登录");
                }
            } else {
                result.put("code", 401);
                result.put("message", "用户名或密码错误");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器内部错误");
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 获取当前登录用户信息
     * @param session HTTP会话
     * @return 用户信息
     */
    @GetMapping("/userinfo")
    public Map<String, Object> getUserInfo(HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        try {
            User currentUser = (User) session.getAttribute("currentUser");

            if (currentUser != null) {
                result.put("code", 200);
                result.put("message", "获取用户信息成功");
                result.put("data", currentUser);
            } else {
                result.put("code", 401);
                result.put("message", "用户未登录");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器内部错误");
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 用户登出接口
     * @param session HTTP会话
     * @return 登出结果
     */
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        try {
            session.invalidate(); // 清除session

            result.put("code", 200);
            result.put("message", "登出成功");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器内部错误");
            e.printStackTrace();
        }

        return result;
    }
}