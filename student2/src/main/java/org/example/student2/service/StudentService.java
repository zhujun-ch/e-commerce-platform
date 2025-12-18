package org.example.student2.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.student2.entity.Student;

import java.util.List;

public interface StudentService extends IService<Student> {
    List<Student> getAllStudents();
    boolean addStudent(Student student);
    boolean updateStudent(Student student);
    boolean deleteStudent(Long id);
    Student getStudentById(Long id);
}