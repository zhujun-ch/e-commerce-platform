package org.example.student2.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("student")
public class Student {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String studentId;      // 学号
    private String name;           // 姓名
    private String gender;         // 性别
    private Integer age;           // 年龄
    private String className;      // 班级
    private String major;          // 专业
    private String phone;          // 电话
    private String email;          // 邮箱
    private String address;        // 地址
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}