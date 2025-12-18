package org.example.student2.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.example.student2.entity.Student;

@Mapper
public interface StudentMapper extends BaseMapper<Student> {
}