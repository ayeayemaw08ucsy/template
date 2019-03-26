package com.bbi.fam.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.model.User;

@Service("workflowService")
@Transactional
public class WorkflowService {
	
	@Autowired
	private RepositoryService repositoryService;
	
	@Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;
    
    public String startProcess(String assignee) {
		User user = userRepository.findByUsername(assignee);
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("user", user);

		runtimeService.startProcessInstanceByKey("simpleProcess", variables);

		return processInfo();
	}

	public List<Task> getTasks(String assignee) {
		return taskService.createTaskQuery().taskCandidateUser(assignee).list();
	}
	
	public void completeTask(String taskId) {
		taskService.complete(taskId);
	}

	private String processInfo() {
		List<Task> tasks = taskService.createTaskQuery().orderByTaskCreateTime().asc().list();
		
		StringBuilder stringBuilder = new StringBuilder();

		stringBuilder.append("Number of process definitions : "
				+ repositoryService.createProcessDefinitionQuery().count() + "--> Tasks >> ");

		for (Task task : tasks) {
			stringBuilder
					.append(task + " | Assignee: " + task.getAssignee() + " | Description: " + task.getDescription());
		}

		return stringBuilder.toString();
	}
	
	public String startGroupProcess(String group) {

		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("userList", "admin, ppa");
		variables.put("key", "1234");

		runtimeService.startProcessInstanceByKey("groupProcess", variables);

		return "done";
	}

}
