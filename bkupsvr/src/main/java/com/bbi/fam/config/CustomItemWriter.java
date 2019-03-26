package com.bbi.fam.config;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.batch.item.ItemWriter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;

import com.bbi.fam.model.PostingTxn;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class CustomItemWriter implements ItemWriter<PostingTxn> {
	
	private String fileDir;
	
	public CustomItemWriter(String fileDir) {
		this.fileDir = fileDir;
	}
	
	@Override
	public void write(List<? extends PostingTxn> items) throws Exception {
		List<PostingTxn> txns = new ArrayList<>();
		for (PostingTxn txn : items) {
			SimpleDateFormat dt1 = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
			Date date = dt1.parse(txn.getBusinessDate());
			SimpleDateFormat dt2 = new SimpleDateFormat("dd-MMM-yyyy");
			txn.setBusinessDate(dt2.format(date));
			txns.add(txn);
		}
		generateDataSourceReport(txns);
	}
	
	public void generateDataSourceReport(List<PostingTxn> reportList) throws IOException {
		// get jasper template
		ClassPathResource reportResource = new ClassPathResource("templates/fa_report_new.jasper");

		// generate source parameters
		Map<String, Object> reportParameters = new HashMap<>();

		JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(reportList, true);
		reportParameters.put("CUSTOM_SOURCE_DATA", itemsJRBean);
		SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM-yyyy");
		String date = DATE_FORMAT.format(new Date());
		exportReportToPDF(reportResource.getInputStream(), reportParameters, "FA-REPORT-" + date + ".pdf");

	}
	
	private ByteArrayResource exportReportToPDF(InputStream targetStream, Map<String, Object> parameters,
			String reportName) {
		try {
			JasperPrint jasperPrint = JasperFillManager.fillReport(targetStream, parameters, new JREmptyDataSource());

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			JasperExportManager.exportReportToPdfStream(jasperPrint, new FileOutputStream(fileDir + reportName));

			byte[] reportContent = outputStream.toByteArray();
			return new ByteArrayResource(reportContent);
		} catch (Exception e) {
			return null;
		}
	}


}
