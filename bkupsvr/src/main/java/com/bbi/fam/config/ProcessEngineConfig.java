package com.bbi.fam.config;

import java.io.IOException;

import javax.sql.DataSource;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.activiti.spring.SpringProcessEngineConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

@Configuration
public class ProcessEngineConfig {

	private static final String BPMN_PATH = "processes/";
	
	@Autowired
	private DataSource dataSource;
	
	@Bean
    public SpringProcessEngineConfiguration processEngineConfiguration() {
           SpringProcessEngineConfiguration config = new SpringProcessEngineConfiguration();

           try {
                 config.setDeploymentResources(getBpmnFiles());
           } catch (IOException e) {
                 e.printStackTrace();
           }

           config.setDataSource(dataSource);
           config.setDatabaseSchemaUpdate("true");
           //config.setDatabaseTablePrefix("BBI_");
           config.setTransactionManager(new DataSourceTransactionManager(dataSource));
           config.setHistory("audit");
           config.setJobExecutorActivate(true);
           return config;
    }

    private Resource[] getBpmnFiles() throws IOException {
           ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
           return resourcePatternResolver.getResources("classpath*:" + BPMN_PATH + "**/*.bpmn20.xml");
    }

    @Bean
    public ProcessEngineFactoryBean processEngine() {
           ProcessEngineFactoryBean factoryBean = new ProcessEngineFactoryBean();
           factoryBean.setProcessEngineConfiguration(processEngineConfiguration());
           return factoryBean;
    }

    @Bean
    public RepositoryService repositoryService(ProcessEngine processEngine) {
           return processEngine.getRepositoryService();
    }

    @Bean
    public IdentityService identityService(ProcessEngine processEngine) {
           return processEngine.getIdentityService();
    }

    @Bean
    public FormService formService(ProcessEngine processEngine) {
           return processEngine.getFormService();
    }

    @Bean
    public RuntimeService runtimeService(ProcessEngine processEngine) {
           return processEngine.getRuntimeService();

    }
	   
    @Bean
    public TaskService taskService(ProcessEngine processEngine) {
           return processEngine.getTaskService();
    }

    @Bean
    public ManagementService managementService(ProcessEngine processEngine) {
           return processEngine.getManagementService();
    } 

    @Bean
    public HistoryService historyService(ProcessEngine processEngine) {
           return processEngine.getHistoryService();
    }
}
