package com.bbi.fam.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.dto.GraphDto;
import com.bbi.fam.dto.ReportDto;
import com.bbi.fam.service.impl.FixedAssetServiceImpl;

@RestController
@RequestMapping("/reports")
public class ReportController {
	
	@Value("${report.file.dir}")
	private String fileDir;
	
	@Autowired
	private FixedAssetServiceImpl faService;

	@RequestMapping(value = "/report", method = RequestMethod.POST)
	public ResponseEntity<Object> listJobHistory(@RequestBody String report) {
		FileSystemResource resource = new FileSystemResource(report);
		HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
		byte[] fileContent = null;
		try {
			fileContent = Files.readAllBytes(resource.getFile().toPath());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new ResponseEntity<Object>(fileContent, headers ,HttpStatus.OK);
	}
	
	@RequestMapping(value = "/report", method = RequestMethod.GET)
	public ResponseEntity<List<ReportDto>> listJobHistory() {
		List<ReportDto> dtoList = new ArrayList<>();
		try {
			List<String> files = getFileNames();
			for (String file : files) {
				ReportDto dto = new ReportDto();
				dto.setReportName(file.substring(0, file.length()-4));
				dto.setUrl(fileDir + file);
				dtoList.add(dto);
			}
		} catch (Exception e) {
			new ResponseEntity<List<ReportDto>>(dtoList , HttpStatus.OK);
		}
		
		return new ResponseEntity<List<ReportDto>>(dtoList , HttpStatus.OK);
	}
	
	public List<String> getFileNames() {
		File folder = new File(fileDir);
		File[] listOfFiles = folder.listFiles();
		List<String> files = new ArrayList<>();

		for (int i = 0; i < listOfFiles.length; i++) {
		  if (listOfFiles[i].isFile()) {
		    files.add(listOfFiles[i].getName());
		  } 
		}
		return files;
	}
	
	@RequestMapping(value = "/fa-graph", method = RequestMethod.GET)
	public GraphDto graphData() {
		return faService.findByAssetType();
	}
	
}
