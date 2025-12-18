package org.example.student2.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.student2.entity.Student;
import org.example.student2.mapper.StudentMapper;
import org.example.student2.service.StudentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements StudentService {

    @Override
    public List<Student> getAllStudents() {
        return this.list();
    }

    @Override
    public boolean addStudent(Student student) {
        student.setCreateTime(LocalDateTime.now());
        student.setUpdateTime(LocalDateTime.now());
        return this.save(student);
    }

    @Override
    public boolean updateStudent(Student student) {
        student.setUpdateTime(LocalDateTime.now());
        return this.updateById(student);
    }

    @Override
    public boolean deleteStudent(Long id) {
        return this.removeById(id);
    }

    @Override
    public Student getStudentById(Long id) {
        return this.getById(id);
    }
}