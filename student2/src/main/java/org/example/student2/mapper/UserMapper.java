package org.example.student2.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.example.student2.entity.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}