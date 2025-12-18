package org.example.student2.controller;

import org.example.student2.entity.Student;
import org.example.student2.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/list")
    public Map<String, Object> getAllStudents() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Student> students = studentService.getAllStudents();
            result.put("code", 200);
            result.put("message", "成功");
            result.put("data", students);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器错误");
        }
        return result;
    }

    @PostMapping("/add")
    public Map<String, Object> addStudent(@RequestBody Student student) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = studentService.addStudent(student);
            result.put("code", success ? 200 : 500);
            result.put("message", success ? "添加成功" : "添加失败");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器错误");
        }
        return result;
    }

    @PutMapping("/update")
    public Map<String, Object> updateStudent(@RequestBody Student student) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = studentService.updateStudent(student);
            result.put("code", success ? 200 : 500);
            result.put("message", success ? "更新成功" : "更新失败");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器错误");
        }
        return result;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteStudent(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = studentService.deleteStudent(id);
            result.put("code", success ? 200 : 500);
            result.put("message", success ? "删除成功" : "删除失败");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "服务器错误");
        }
        return result;
    }
}