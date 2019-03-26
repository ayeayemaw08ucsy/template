package com.bbi.fam.controller;

import java.util.List;

import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.service.WorkflowService;

@RestController
public class WorkflowController {

	@Autowired
    private WorkflowService workflowService;

	@RequestMapping(value = "/process")
	public String startProcessInstance(@RequestParam String assignee) {
		return workflowService.startGroupProcess(assignee);
	}

	@RequestMapping(value = "/tasks/{assignee}")
	public String getTasks(@PathVariable("assignee") String assignee) {
		List<Task> tasks = workflowService.getTasks(assignee);
		return tasks.toString();
	}

	@RequestMapping(value = "/completetask")
	public String completeTask(@RequestParam String id) {
		workflowService.completeTask(id);
		return "Task with id " + id + " has been completed!";
	}

}
