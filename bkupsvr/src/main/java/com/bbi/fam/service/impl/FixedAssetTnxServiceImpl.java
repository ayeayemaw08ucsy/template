package com.bbi.fam.service.impl;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.image.WritableRaster;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.CodeValueRepository;
import com.bbi.fam.dao.FixedAssetAdditionalInfoRepository;
import com.bbi.fam.dao.FixedAssetAdditionalInfoTnxRepository;
import com.bbi.fam.dao.FixedAssetRepository;
import com.bbi.fam.dao.FixedAssetTnxRepository;
import com.bbi.fam.dao.PictureAndQRInfoRepository;
import com.bbi.fam.dao.PictureAndQRInfoTnxRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.FixedAssetAdditionalInfo;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;
import com.bbi.fam.model.FixedAssetTnx;
import com.bbi.fam.model.PictureAndQRInfo;
import com.bbi.fam.model.PictureAndQRInfoTnx;
import com.bbi.fam.model.User;
import com.bbi.fam.service.FixedAssetTnxService;
import com.bbi.fam.utils.Common;
import com.bbi.fam.utils.CustomIdGeneration;
import com.bbi.fam.utils.ImageWriter;
import com.bbi.fam.utils.QRCodeGenerator;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

@Service(value = "fixedAssetTnxService")
public class FixedAssetTnxServiceImpl implements FixedAssetTnxService {
	
	@Autowired
	private FixedAssetTnxRepository fixedAssetTnxRepository;
	
	@Autowired
	private AccountHelperImpl accountHelperImpl;
	
	@Autowired
	private FixedAssetRepository fixedAssetRepository;
	
	@Autowired
	private FixedAssetAdditionalInfoRepository fixedAssetAdditionalInfoRepository;
	
	@Autowired
	private FixedAssetAdditionalInfoTnxRepository fixedAssetAdditionalInfoTnxRepository;
	
	@Autowired
	private PictureAndQRInfoRepository pictureAndQRInfoRepository;
	
	@Autowired
	private PictureAndQRInfoTnxRepository pictureAndQRInfoTnxRepository;
	
	@Autowired
	private CodeValueRepository codeValueRepository;
	
	@Autowired
	private UserRepository	userRepository;
	
	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	
	@Value("${img.path}")
	public String path;
	private final String ext = ".png";
    private final int WIDTH = 300;
    private final int HEIGHT = 300;
    
    @Value("${img.path}")
	public String base_path;	
	String pic_folder = "/Picture";

	public static CustomIdGeneration idGen = new CustomIdGeneration();
	
	@Override
	@Transactional("transactionManager")
	public FixedAssetTnx save(FixedAssetTnx fixedAssetTnx) {
		return fixedAssetTnxRepository.save(fixedAssetTnx);
	}

	@Override
	public List<FixedAssetTnx> findAll() {
		List<FixedAssetTnx> list = new ArrayList<>();
		fixedAssetTnxRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public FixedAssetTnx findOne(String fixedAssetTnxSeqId) {
		return fixedAssetTnxRepository.findByFixedAssetTnxSeqId(fixedAssetTnxSeqId);
	}

	@Override
	public List<FixedAssetTnx> findByTnxStatusCode(String tnxStatusCode) {
		return fixedAssetTnxRepository.findByTnxStatusCode(tnxStatusCode);
	}
	
	@Override
	public List<FixedAssetTnx> getAllFixedAssetTnx() {
		List<FixedAssetTnx> list = new ArrayList<>();
		fixedAssetTnxRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	@Transactional("transactionManager")
	public FixedAsset delete(String id) throws FamApplicationException, Exception {
		
		FixedAssetTnx fixedAssetTnx = fixedAssetTnxRepository.findByFixedAssetTnxSeqId(id) ;
		FixedAsset fixedAsset = new FixedAsset();
		fixedAssetAdditionalInfoTnxRepository.deleteByFixedAssetTnx(fixedAssetTnx);
		pictureAndQRInfoTnxRepository.deleteByFixedAssetTnx(fixedAssetTnx);
		fixedAssetTnxRepository.deleteByFixedAssetTnxSeqId(id);
		fixedAsset.setFixedAssetTnxSeqId(id);
		
		return fixedAsset;
	}

	@Override
	public FixedAssetTnx update(FixedAssetTnx fixedAssetTnx) throws FamApplicationException {
		return null;
	}

	@Override
	@Transactional("transactionManager")
	public FixedAssetTnx requestForRegister(FixedAssetTnx fixedAssetTnx) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		FixedAsset checkFixedAsset = fixedAssetRepository.findByProdRefId(fixedAssetTnx.getProdRefId());		
		
		System.out.println("check fixed asset " + checkFixedAsset);
		
		if (checkFixedAsset == null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				fixedAssetTnx.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			FixedAssetTnx tnx = fixedAssetTnxRepository.findByProdRefIdAndTnxStatusCode(fixedAssetTnx.getProdRefId(), "01");
			if (tnx == null) {
				
				tnx = new FixedAssetTnx();
				tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			}	
			tnx.setEntity(fixedAssetTnx.getEntity());
			tnx.setProductCode(fixedAssetTnx.getProductCode());
			tnx.setAssetType(fixedAssetTnx.getAssetType());
			tnx.setAssetSubType(fixedAssetTnx.getAssetSubType());
			tnx.setProdRefId(fixedAssetTnx.getProdRefId());
			tnx.setBusinessDate(new Date());
			tnx.setInvoiceDate(fixedAssetTnx.getInvoiceDate());
			tnx.setInvoiceRef(fixedAssetTnx.getInvoiceRef());
			tnx.setInvUnitPrice(fixedAssetTnx.getInvUnitPrice());
			tnx.setInvQuantity(fixedAssetTnx.getInvQuantity());
			tnx.setInvCurrency(fixedAssetTnx.getInvCurrency());
			tnx.setInvAmount(fixedAssetTnx.getInvAmount());
			tnx.setExchRate(fixedAssetTnx.getExchRate());
			tnx.setTnxCurrency(fixedAssetTnx.getTnxCurrency());
			tnx.setTnxAmount(fixedAssetTnx.getTnxAmount());
			tnx.setBookCurrency(fixedAssetTnx.getBookCurrency());
			tnx.setBookAmt(fixedAssetTnx.getBookAmt());
			tnx.setPurchaseDate(fixedAssetTnx.getPurchaseDate());
			tnx.setAssetDesc1(fixedAssetTnx.getAssetDesc1());
			tnx.setAssetDesc2(fixedAssetTnx.getAssetDesc2());
			tnx.setAssetModel(fixedAssetTnx.getAssetModel());
			tnx.setSerialNo(fixedAssetTnx.getSerialNo());
			tnx.setUniqueId(fixedAssetTnx.getUniqueId());
			tnx.setAssetQuantity(fixedAssetTnx.getAssetQuantity());			
			tnx.setBranchCode(fixedAssetTnx.getBranchCode());
			tnx.setDeptCode(fixedAssetTnx.getDeptCode());
			tnx.setDepMethod(fixedAssetTnx.getDepMethod());
			tnx.setDepRate(fixedAssetTnx.getDepRate());
			tnx.setDepUsefulLife(fixedAssetTnx.getDepUsefulLife());
			tnx.setDepCollFrequency(fixedAssetTnx.getDepCollFrequency());
			tnx.setResidualCurrency(fixedAssetTnx.getResidualCurrency());
			tnx.setResidualValue(fixedAssetTnx.getResidualValue());
			tnx.setAccumDepCurrency(fixedAssetTnx.getAccumDepCurrency());
			tnx.setAccumDepAmt(fixedAssetTnx.getAccumDepAmt());	
			tnx.setDepSequence(0);
			tnx.setNetAssetCurrency(fixedAssetTnx.getNetAssetCurrency());
			tnx.setNetAssetAmount(fixedAssetTnx.getNetAssetAmount());
			tnx.setVendorCode(fixedAssetTnx.getVendorCode());
			tnx.setVendorName(fixedAssetTnx.getVendorName());
			tnx.setProdStatusCode("01");
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			tnx.setAssetTracking(fixedAssetTnx.getAssetTracking());
			fixedAssetTnxRepository.save(tnx);
			
			FixedAssetAdditionalInfoTnx addlTnx = null;
			if (fixedAssetTnx.getAddlInfoTnx() != null) {
				
				addlTnx = fixedAssetAdditionalInfoTnxRepository.findByProdRefId(fixedAssetTnx.getProdRefId());
				if (addlTnx == null) {
					addlTnx = new FixedAssetAdditionalInfoTnx();					
					addlTnx = fixedAssetTnx.getAddlInfoTnx();
					addlTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));			
					addlTnx.setFixedAssetTnx(tnx);
				} else {
					addlTnx = fixedAssetTnx.getAddlInfoTnx();
					addlTnx.setFixedAssetTnx(tnx);
				}				
				fixedAssetAdditionalInfoTnxRepository.save(addlTnx);			
			}
			
			String imgSrc = "";
			PictureAndQRInfoTnx imgTnx = null;			
			if (fixedAssetTnx.getImgInfoTnx() != null) {
				
				imgSrc = fixedAssetTnx.getImgInfoTnx().getImageSrc();
				int imgIndex = imgSrc.indexOf("base64,");
				System.out.println("imgIndex " + imgIndex);
				System.out.println("base path " + base_path);
				System.out.println("img src " + imgSrc.substring(imgIndex + 7, imgSrc.length()));
				String path = base_path + fixedAssetTnx.getProdRefId() + pic_folder;
				String pic_name = path + "/fixed-asset-1.jpeg"; 
				
				imgTnx = pictureAndQRInfoTnxRepository.findByProdRefId(fixedAssetTnx.getProdRefId());
				if (imgTnx == null) {
					
					imgTnx = new PictureAndQRInfoTnx();
					imgTnx = fixedAssetTnx.getImgInfoTnx();
					imgTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					imgTnx.setFixedAssetTnx(tnx);
					
					ImageWriter imgWriter = new ImageWriter();
					imgWriter.writeRequestAndResponse(fixedAssetTnx.getProdRefId(), imgSrc.substring(imgIndex + 7, imgSrc.length()), path, pic_name);
					
				} else {
					imgTnx = fixedAssetTnx.getImgInfoTnx();
					imgTnx.setFixedAssetTnx(tnx);
					
					if (!imgTnx.getPictureFileName().equalsIgnoreCase("") || !imgTnx.getPictureFileName().equals(null)) {
						ImageWriter imgWriter = new ImageWriter();
						imgWriter.writeRequestAndResponse(fixedAssetTnx.getProdRefId(), imgSrc.substring(imgIndex + 7, imgSrc.length()), path, pic_name);
					}
				}
				
				pictureAndQRInfoTnxRepository.save(imgTnx);
			}
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Product " + fixedAssetTnx.getProdRefId() + " is saved as draft."));
			apiMsg.setMessage("Product " + fixedAssetTnx.getProdRefId() + " is saved as draft.");
			
		} else {			
			FixedAsset errFa = new FixedAsset();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Duplicate Branch Code."));
			err.setMessage("Product " + fixedAssetTnx.getProdRefId() + " already exist.");
			// fixedAsset.setApiError(err);
			
			throw new FamApplicationException("Product " + fixedAssetTnx.getProdRefId() + " already exist.");
		}
		return fixedAssetTnx;
	}

	
	/**
	 * 
	 * @param assignee : parameter of assignee
	 * @return: FixedAssetTnxList
	 */
	public List<FixedAssetTnx> getTasks(String assignee) {
		
		List<FixedAssetTnx> txnList = new ArrayList<FixedAssetTnx>();
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("fixedAssetProcess").list();
		
		for (Task task : taskList) {
			FixedAssetTnx txn = new FixedAssetTnx();
			txn = fixedAssetTnxRepository.findById(task.getFormKey()).get();
			txn.setTaskId(task.getId());
			txnList.add(txn);
		}
		return txnList;
	}
	
	/**
	 * 
	 * @param fixedAssetTnx
	 * @return: return FixedAssetTnx.
	 */
	public Task startPendingTask(FixedAssetTnx fixedAssetTnx) {
			
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("userList","admin,ppa");
	 	variables.put("key", fixedAssetTnx.getFixedAssetTnxSeqId());
	 	Task task = null;
	 	ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("faupdateprocess", variables);
	 	 List<Task> tasks = taskService.createTaskQuery()
	                .processInstanceId(processInstance.getId())
	                .orderByTaskName().asc()
	                .list();
	 	 
	 	 for(Task t : tasks) {
	 		task = t;
	 		break;
	 	 }
		
		return task;
	}
	
	/**
	 * 
	 * @param fixedAssetTnx
	 * @return: return FixedAssetTnx.
	 */
	public Task startPendingDisposeTask(FixedAssetTnx fixedAssetTnx) {
			
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("userList","admin,ppa");
	 	variables.put("key", fixedAssetTnx.getFixedAssetTnxSeqId());
	 	Task task = null;
	 	ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("fadisposeprocess", variables);
	 	 List<Task> tasks = taskService.createTaskQuery()
	                .processInstanceId(processInstance.getId())
	                .orderByTaskName().asc()
	                .list();
	 	 
	 	 for(Task t : tasks) {
	 		task = t;
	 		break;
	 	 }
		
		return task;
	}
	
	public void endPendingTask(String taskId) {
		taskService.complete(taskId);
	}
	
	
	/**
	 * Update Task
	 * @param fixedAssetTnx
	 * @return: return FixedAssetTnx.
	 */
	public Task startUpdateTask(FixedAssetTnx fixedAssetTnx) {
			
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("userList","admin,ppa");
	 	variables.put("key", fixedAssetTnx.getFixedAssetTnxSeqId());
	 	Task task = null;
	 	ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("faupdateprocess", variables);
	 	 List<Task> tasks = taskService.createTaskQuery()
	                .processInstanceId(processInstance.getId())
	                .orderByTaskName().desc()
	                .list();
	 	 
	 	 for(Task t : tasks) {
	 		task = t;
	 		break;
	 	 }
		
		return task;
	}
	
	
	/**
	 * 
	 * @param fixedAssetTnx
	 */
	public void endTask(FixedAssetTnx fixedAssetTnx) {
		taskService.complete(fixedAssetTnx.getTaskId());
	}
	
	/**
	 * 
	 * @param fixedAssetTnx : Parameter of FixedAsset Tnx
	 * @return FixedAssetTnx
	 */
	@Transactional("transactionManager")
	public FixedAssetTnx swapFixedAssetTnxBean(FixedAssetTnx fixedAssetTnx) {
		
		FixedAssetTnx tnx = new FixedAssetTnx();	
		
		tnx.setEntity(fixedAssetTnx.getEntity());
		tnx.setProductCode(fixedAssetTnx.getProductCode());
		tnx.setAssetType(fixedAssetTnx.getAssetType());
		tnx.setAssetSubType(fixedAssetTnx.getAssetSubType());
		tnx.setProdRefId(fixedAssetTnx.getProdRefId());
		tnx.setBusinessDate(new Date());
		tnx.setInvoiceDate(new Date());
		tnx.setInvoiceRef(fixedAssetTnx.getInvoiceRef());
		tnx.setInvUnitPrice(fixedAssetTnx.getInvUnitPrice());
		tnx.setInvQuantity(fixedAssetTnx.getInvQuantity());
		tnx.setInvCurrency(fixedAssetTnx.getInvCurrency());
		tnx.setInvAmount(fixedAssetTnx.getInvAmount());
		tnx.setExchRate(fixedAssetTnx.getExchRate());
		tnx.setTnxCurrency(fixedAssetTnx.getTnxCurrency());
		tnx.setTnxAmount(fixedAssetTnx.getTnxAmount());
		tnx.setBookCurrency(fixedAssetTnx.getBookCurrency());
		tnx.setBookAmt(fixedAssetTnx.getBookAmt());
		tnx.setPurchaseDate(new Date());
		tnx.setAssetDesc1(fixedAssetTnx.getAssetDesc1());
		tnx.setAssetDesc2(fixedAssetTnx.getAssetDesc2());
		tnx.setAssetModel(fixedAssetTnx.getAssetModel());
		tnx.setSerialNo(fixedAssetTnx.getSerialNo());
		tnx.setUniqueId(fixedAssetTnx.getUniqueId());
		tnx.setAssetQuantity(fixedAssetTnx.getAssetQuantity());			
		tnx.setBranchCode(fixedAssetTnx.getBranchCode());
		tnx.setDeptCode(fixedAssetTnx.getDeptCode());
		tnx.setDepMethod(fixedAssetTnx.getDepMethod());
		tnx.setDepRate(fixedAssetTnx.getDepRate());
		tnx.setDepUsefulLife(fixedAssetTnx.getDepUsefulLife());
		tnx.setDepCollFrequency(fixedAssetTnx.getDepCollFrequency());
		tnx.setResidualCurrency(fixedAssetTnx.getResidualCurrency());
		tnx.setResidualValue(fixedAssetTnx.getResidualValue());
		tnx.setAccumDepCurrency(fixedAssetTnx.getAccumDepCurrency());
		tnx.setAccumDepAmt(fixedAssetTnx.getAccumDepAmt());	
		tnx.setDepSequence(0);
		tnx.setNetAssetCurrency(fixedAssetTnx.getNetAssetCurrency());
		tnx.setNetAssetAmount(fixedAssetTnx.getNetAssetAmount());
		tnx.setVendorCode(fixedAssetTnx.getVendorCode());
		tnx.setVendorName(fixedAssetTnx.getVendorName());
		
		return tnx; 
	}
	
	
	/**
	 * 
	 * @param fixedAssetTnx : parameter of FixedAssetTnx Object.
	 * @return FixedAssetAdditonalInfo.
	 */
	public FixedAssetAdditionalInfo swapFixedAssetAdditionalInfoBean(FixedAssetTnx fixedAssetTnx) {
		
		FixedAssetAdditionalInfo addl = new FixedAssetAdditionalInfo();
		addl.setFixedAssetAddlMstSeqId(idGen.generateTxnId(new Date()));
		addl.setEntity(fixedAssetTnx.getEntity());
		addl.setProductCode(fixedAssetTnx.getProductCode());
		addl.setProdRefId(fixedAssetTnx.getProdRefId());
		addl.setBusinessDate(new Date());
		addl.setNote1(fixedAssetTnx.getAddlInfoTnx().getNote1());
		addl.setNote2(fixedAssetTnx.getAddlInfoTnx().getNote2());
		addl.setNote3(fixedAssetTnx.getAddlInfoTnx().getNote3());
		addl.setNote4(fixedAssetTnx.getAddlInfoTnx().getNote4());
		addl.setInsuranceName(fixedAssetTnx.getAddlInfoTnx().getInsuranceName());
		addl.setInsuranceCode(fixedAssetTnx.getAddlInfoTnx().getInsuranceCode());
		addl.setInsuranceType(fixedAssetTnx.getAddlInfoTnx().getInsuranceType());
		addl.setInsuranceFrom(fixedAssetTnx.getAddlInfoTnx().getInsuranceFrom());
		addl.setInsuranceTo(fixedAssetTnx.getAddlInfoTnx().getInsuranceTo());
		addl.setWarrantyName(fixedAssetTnx.getAddlInfoTnx().getWarrantyName());
		addl.setWarrantyCode(fixedAssetTnx.getAddlInfoTnx().getWarrantyCode());
		addl.setWarrantyType(fixedAssetTnx.getAddlInfoTnx().getWarrantyType());
		addl.setWarrantyFrom(fixedAssetTnx.getAddlInfoTnx().getWarrantyFrom());
		addl.setWarrantyTo(fixedAssetTnx.getAddlInfoTnx().getWarrantyTo());
		addl.setSupportName(fixedAssetTnx.getAddlInfoTnx().getSupportName());
		addl.setSupportCode(fixedAssetTnx.getAddlInfoTnx().getSupportCode());
		addl.setSupportType(fixedAssetTnx.getAddlInfoTnx().getSupportType());
		addl.setSupportFrom(fixedAssetTnx.getAddlInfoTnx().getSupportFrom());
		addl.setSupportTo(fixedAssetTnx.getAddlInfoTnx().getSupportTo());
		addl.setTaxType(fixedAssetTnx.getAddlInfoTnx().getTaxType());
		addl.setTaxName(fixedAssetTnx.getAddlInfoTnx().getTaxName());
		addl.setTaxRate(fixedAssetTnx.getAddlInfoTnx().getTaxRate());
		addl.setTaxCurrency(fixedAssetTnx.getAddlInfoTnx().getTaxCurrency());
		addl.setTaxAmount(fixedAssetTnx.getAddlInfoTnx().getTaxAmount());
		addl.setFinanceType(fixedAssetTnx.getAddlInfoTnx().getFinanceType());
		addl.setFinanceCode(fixedAssetTnx.getAddlInfoTnx().getFinanceCode());
		addl.setFinanceName(fixedAssetTnx.getAddlInfoTnx().getFinanceName());
		addl.setFinanceCurrency(fixedAssetTnx.getAddlInfoTnx().getFinanceCurrency());
		addl.setFinanceAmt(fixedAssetTnx.getAddlInfoTnx().getFinanceAmt());
		addl.setRate(fixedAssetTnx.getAddlInfoTnx().getRate());
		addl.setFinanceFrom(fixedAssetTnx.getAddlInfoTnx().getFinanceFrom());
		addl.setFinanceTo(fixedAssetTnx.getAddlInfoTnx().getFinanceTo());
		return addl;
	}
	
	
	/**
	 * 
	 * @param fixedAssetTnx :parameter of FixedAssetTnx Object
	 * @return PictureAndQRInfoTnx.
	 */
	public PictureAndQRInfoTnx swapPictureAndQRInfoTnx(FixedAssetTnx fixedAssetTnx) {
		
		PictureAndQRInfoTnx imgTnx = new PictureAndQRInfoTnx();
		imgTnx.setEntity(fixedAssetTnx.getEntity());
		imgTnx.setProductCode(fixedAssetTnx.getProductCode());
		imgTnx.setProdRefId(fixedAssetTnx.getProdRefId());
		imgTnx.setBusinessDate(new Date());
		imgTnx.setTrackingCode(fixedAssetTnx.getImgInfoTnx().getTrackingCode());
		imgTnx.setTrackingFileName(fixedAssetTnx.getImgInfoTnx().getTrackingFileName());
		imgTnx.setTrackingFileLocation(fixedAssetTnx.getImgInfoTnx().getTrackingFileLocation());
		imgTnx.setTrackingCreateDate(new Date());
		imgTnx.setVerifiedCode(fixedAssetTnx.getImgInfoTnx().getVerifiedCode());
		imgTnx.setVerifiedFileName(fixedAssetTnx.getImgInfoTnx().getVerifiedFileName());
		imgTnx.setVerifiedFileLocation(fixedAssetTnx.getImgInfoTnx().getVerifiedFileLocation());
		imgTnx.setVerifiedDate(new Date());
		imgTnx.setPictureCode(fixedAssetTnx.getImgInfoTnx().getPictureCode());
		imgTnx.setPictureFileName(fixedAssetTnx.getImgInfoTnx().getPictureFileName());
		imgTnx.setPictureFileLocation(fixedAssetTnx.getImgInfoTnx().getPictureFileLocation());
		imgTnx.setPictureCaptureDate(new Date());
		
		return imgTnx;
	}
	
	/**
	 * 
	 * @param fixedAssetTnx :parameter of FixedAssetTnx Object
	 * @return PictureAndQRInfoTnx.
	 */
	public PictureAndQRInfo swapPictureAndQRInfo(FixedAssetTnx fixedAssetTnx) {
		
		PictureAndQRInfo img = new PictureAndQRInfo();
		img.setEntity(fixedAssetTnx.getEntity());
		img.setProductCode(fixedAssetTnx.getProductCode());
		img.setProdRefId(fixedAssetTnx.getProdRefId());
		img.setBusinessDate(new Date());
		img.setTrackingCode(fixedAssetTnx.getImgInfoTnx().getTrackingCode());
		img.setTrackingFileName(fixedAssetTnx.getImgInfoTnx().getTrackingFileName());
		img.setTrackingFileLocation(fixedAssetTnx.getImgInfoTnx().getTrackingFileLocation());
		img.setTrackingCreateDate(new Date());
		img.setVerifiedCode(fixedAssetTnx.getImgInfoTnx().getVerifiedCode());
		img.setVerifiedFileName(fixedAssetTnx.getImgInfoTnx().getVerifiedFileName());
		img.setVerifiedFileLocation(fixedAssetTnx.getImgInfoTnx().getVerifiedFileLocation());
		img.setVerifiedDate(new Date());
		img.setPictureCode(fixedAssetTnx.getImgInfoTnx().getPictureCode());
		img.setPictureFileName(fixedAssetTnx.getImgInfoTnx().getPictureFileName());
		img.setPictureFileLocation(fixedAssetTnx.getImgInfoTnx().getPictureFileLocation());
		img.setPictureCaptureDate(new Date());
		
		return img;
	}

	@Override
	public FixedAssetTnx findByProductRefIdAndProdStatusCodeAndTnxStatusCodeAndTnxTypeAndTnxSubType(String prodRefId,
			String prodStatusCode, String tnxStatusCode, String tnxType, String tnxSubType) throws FamApplicationException {
		return fixedAssetTnxRepository.findByProdRefIdAndProdStatusCodeAndTnxStatusCodeAndTnxTypeAndTnxSubType(prodRefId, prodStatusCode, tnxStatusCode, tnxType, tnxSubType);
	}

	@Override
	public FixedAssetTnx findByProductRefIdAndProdStatusCodeAndTnxStatusCode(String prodRefId, String prodStatusCode,
			String tnxStatusCode) throws FamApplicationException {
		
		FixedAssetTnx fa = new FixedAssetTnx();
		fa = fixedAssetTnxRepository.findByProdRefIdAndProdStatusCodeAndTnxStatusCode(prodRefId, prodStatusCode, tnxStatusCode);
		//return fixedAssetTnxRepository.findByProdRefIdAndProdStatusCodeAndTnxStatusCode(prodRefId, prodStatusCode, tnxStatusCode);
		
		System.out.println("FA " + fa);
//		PictureAndQRInfoTnx imgInfoTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(fa);
//		System.out.println("imgInfoTnx " + imgInfoTnx);
//		//fa.setImgInfoTnx(imgInfoTnx);
		
		return fa;
	}
	
	@Override
	public FixedAssetAdditionalInfoTnx findByfixedAssetTnx(FixedAssetTnx tnx) {
		
		FixedAssetAdditionalInfoTnx addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);		
		System.out.println("Addl " + addlTnx);	
		
		return addlTnx;
	}
	
	@Override
	public PictureAndQRInfoTnx findPictureByfixedAssetTnx(FixedAssetTnx tnx) {
		
		Encoder encoder = Base64.getEncoder();
		String imgSrc = "";
		String qrSrc = "";
		byte[] img_byte = null;
		byte[] qr_byte = null;
		PictureAndQRInfoTnx imgInfoTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);		
		
		System.out.println("imgInfoTnx " + imgInfoTnx);	
		
		if (imgInfoTnx != null) {
			
			File imgPath = new File(imgInfoTnx.getPictureFileName());			
			try {
				img_byte = Files.readAllBytes(imgPath.toPath());
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			imgSrc = encoder.encodeToString(img_byte);
			imgInfoTnx.setImageSrc(imgSrc);
			System.out.println("src " + imgInfoTnx.getImageSrc());
			
			if (imgInfoTnx.getTrackingFileName() != null && !imgInfoTnx.getTrackingFileName().equalsIgnoreCase("")) {	
				
				File qrPath = new File(imgInfoTnx.getTrackingFileName());				
				try {
					qr_byte = Files.readAllBytes(qrPath.toPath());
				} catch (IOException e) {
					e.printStackTrace();
				}				
				qrSrc = encoder.encodeToString(qr_byte);
				imgInfoTnx.setQrSrc(qrSrc);
				System.out.println("qr src " + imgInfoTnx.getQrSrc());
			}
			
		}
		
		return imgInfoTnx;
	}

	@Override
	public List<FixedAsset> findByProdStatusCodeAndTnxStatusCodeAndTnxType(String prodStatusCode,
			String tnxStatusCode, String tnxType) throws FamApplicationException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<FixedAssetTnx> falst = new ArrayList<>();
		FixedAssetAdditionalInfoTnx addlInfoTnx = null;
		PictureAndQRInfoTnx imgInfoTnx = null;
		falst = fixedAssetTnxRepository.findByProdStatusCodeAndTnxStatusCodeAndTnxType(prodStatusCode, tnxStatusCode, tnxType);
		System.out.println("falst " + falst);
		for (int j=0; j<falst.size(); j++) {
			if (falst.get(j).getInputUser().equals(loginUser.getUsername())) {
				falst.get(j).setAuthorize(false);
			} else {
				falst.get(j).setAuthorize(true);
			}
		}
		
		List<FixedAsset> fixedAssetList = new ArrayList<>();
		if (falst != null && !falst.isEmpty()) {
			
			for (int i=0; i<falst.size(); i++) {
				FixedAsset fixedAsset = new FixedAsset();
				
				fixedAsset.setEntity(falst.get(i).getEntity());
				fixedAsset.setProductCode(falst.get(i).getProductCode());
				fixedAsset.setAssetType(falst.get(i).getAssetType());
				fixedAsset.setAssetSubType(falst.get(i).getAssetSubType());
				fixedAsset.setProdRefId(falst.get(i).getProdRefId());
				fixedAsset.setBusinessDate(falst.get(i).getBusinessDate());
				fixedAsset.setInvoiceDate(falst.get(i).getInvoiceDate());
				fixedAsset.setInvoiceRef(falst.get(i).getInvoiceRef());
				fixedAsset.setInvUnitPrice(falst.get(i).getInvUnitPrice());
				fixedAsset.setInvQuantity(falst.get(i).getInvQuantity());
				fixedAsset.setInvCurrency(falst.get(i).getInvCurrency());
				fixedAsset.setInvAmount(falst.get(i).getInvAmount());
				fixedAsset.setExchRate(falst.get(i).getExchRate());
				fixedAsset.setTnxCurrency(falst.get(i).getTnxCurrency());
				fixedAsset.setTnxAmount(falst.get(i).getTnxAmount());
				fixedAsset.setBookCurrency(falst.get(i).getBookCurrency());
				fixedAsset.setBookAmt(falst.get(i).getBookAmt());
				fixedAsset.setPurchaseDate(falst.get(i).getPurchaseDate());
				fixedAsset.setAssetDesc1(falst.get(i).getAssetDesc1());
				fixedAsset.setAssetDesc2(falst.get(i).getAssetDesc2());
				fixedAsset.setAssetModel(falst.get(i).getAssetModel());
				fixedAsset.setSerialNo(falst.get(i).getSerialNo());
				fixedAsset.setUniqueId(falst.get(i).getUniqueId());
				fixedAsset.setAssetQuantity(falst.get(i).getAssetQuantity());			
				fixedAsset.setBranchCode(falst.get(i).getBranchCode());
				fixedAsset.setDeptCode(falst.get(i).getDeptCode());
				fixedAsset.setDepMethod(falst.get(i).getDepMethod());
				fixedAsset.setDepRate(falst.get(i).getDepRate());
				fixedAsset.setDepUsefulLife(falst.get(i).getDepUsefulLife());
				fixedAsset.setDepCollFrequency(falst.get(i).getDepCollFrequency());
				fixedAsset.setResidualCurrency(falst.get(i).getResidualCurrency());
				fixedAsset.setResidualValue(falst.get(i).getResidualValue());
				fixedAsset.setAccumDepCurrency(falst.get(i).getAccumDepCurrency());
				fixedAsset.setAccumDepAmt(falst.get(i).getAccumDepAmt());	
				fixedAsset.setDepSequence(falst.get(i).getDepSequence());
				fixedAsset.setNetAssetCurrency(falst.get(i).getBookCurrency());
				fixedAsset.setNetAssetAmount(falst.get(i).getNetAssetAmount());
				fixedAsset.setVendorCode(falst.get(i).getVendorCode());
				fixedAsset.setVendorName(falst.get(i).getVendorName());
				fixedAsset.setProdStatusCode(falst.get(i).getProdStatusCode());
				fixedAsset.setTnxStatusCode(falst.get(i).getTnxStatusCode());
				fixedAsset.setFixedAssetTnxSeqId(falst.get(i).getFixedAssetTnxSeqId());
				fixedAsset.setInputUser(falst.get(i).getInputUser());
				fixedAsset.setAssetTracking(falst.get(i).getAssetTracking());
				fixedAsset.setAuthorize(falst.get(i).isAuthorize());
				if (prodStatusCode.equalsIgnoreCase("01") && tnxStatusCode.equalsIgnoreCase("01")) {
					fixedAsset.setDraft(true);
					fixedAsset.setRegister(false);
					fixedAsset.setAmendApprove(false);
				} else if (prodStatusCode.equalsIgnoreCase("01") && tnxStatusCode.equalsIgnoreCase("02")) {
					fixedAsset.setRegister(true);
					fixedAsset.setDraft(false);
					fixedAsset.setAmendApprove(false);
				} else if (prodStatusCode.equalsIgnoreCase("02") && tnxStatusCode.equalsIgnoreCase("02")) {
					fixedAsset.setRegister(false);
					fixedAsset.setDraft(false);
					fixedAsset.setAmendApprove(true);
				}
				
				addlInfoTnx = new FixedAssetAdditionalInfoTnx();
				addlInfoTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(falst.get(i));
				System.out.println("addlInfoTnx " + addlInfoTnx);
				if (addlInfoTnx != null) {
					falst.get(i).setAddlInfoTnx(addlInfoTnx);				
					// FixedAssetAdditionalInfo addlInfo = this.swapFixedAssetAdditionalInfoBean(falst.get(i));		
					FixedAssetAdditionalInfo addl = new FixedAssetAdditionalInfo();
					addl.setFixedAssetAddlTnxSeqId(falst.get(i).getAddlInfoTnx().getFixedAssetAddlTnxSeqId());
					addl.setEntity(falst.get(i).getEntity());
					addl.setProductCode(falst.get(i).getProductCode());
					addl.setProdRefId(falst.get(i).getProdRefId());
					addl.setBusinessDate(new Date());
					addl.setNote1(falst.get(i).getAddlInfoTnx().getNote1());
					addl.setNote2(falst.get(i).getAddlInfoTnx().getNote2());
					addl.setNote3(falst.get(i).getAddlInfoTnx().getNote3());
					addl.setNote4(falst.get(i).getAddlInfoTnx().getNote4());
					addl.setInsuranceName(falst.get(i).getAddlInfoTnx().getInsuranceName());
					addl.setInsuranceCode(falst.get(i).getAddlInfoTnx().getInsuranceCode());
					addl.setInsuranceType(falst.get(i).getAddlInfoTnx().getInsuranceType());
					addl.setInsuranceFrom(falst.get(i).getAddlInfoTnx().getInsuranceFrom());
					addl.setInsuranceTo(falst.get(i).getAddlInfoTnx().getInsuranceTo());
					addl.setWarrantyName(falst.get(i).getAddlInfoTnx().getWarrantyName());
					addl.setWarrantyCode(falst.get(i).getAddlInfoTnx().getWarrantyCode());
					addl.setWarrantyType(falst.get(i).getAddlInfoTnx().getWarrantyType());
					addl.setWarrantyFrom(falst.get(i).getAddlInfoTnx().getWarrantyFrom());
					addl.setWarrantyTo(falst.get(i).getAddlInfoTnx().getWarrantyTo());
					addl.setSupportName(falst.get(i).getAddlInfoTnx().getSupportName());
					addl.setSupportCode(falst.get(i).getAddlInfoTnx().getSupportCode());
					addl.setSupportType(falst.get(i).getAddlInfoTnx().getSupportType());
					addl.setSupportFrom(falst.get(i).getAddlInfoTnx().getSupportFrom());
					addl.setSupportTo(falst.get(i).getAddlInfoTnx().getSupportTo());
					addl.setTaxType(falst.get(i).getAddlInfoTnx().getTaxType());
					addl.setTaxName(falst.get(i).getAddlInfoTnx().getTaxName());
					addl.setTaxRate(falst.get(i).getAddlInfoTnx().getTaxRate());
					addl.setTaxCurrency(falst.get(i).getAddlInfoTnx().getTaxCurrency());
					addl.setTaxAmount(falst.get(i).getAddlInfoTnx().getTaxAmount());
					addl.setFinanceType(falst.get(i).getAddlInfoTnx().getFinanceType());
					addl.setFinanceCode(falst.get(i).getAddlInfoTnx().getFinanceCode());
					addl.setFinanceName(falst.get(i).getAddlInfoTnx().getFinanceName());
					addl.setFinanceCurrency(falst.get(i).getAddlInfoTnx().getFinanceCurrency());
					addl.setFinanceAmt(falst.get(i).getAddlInfoTnx().getFinanceAmt());
					addl.setRate(falst.get(i).getAddlInfoTnx().getRate());
					addl.setFinanceFrom(falst.get(i).getAddlInfoTnx().getFinanceFrom());
					addl.setFinanceTo(falst.get(i).getAddlInfoTnx().getFinanceTo());
					fixedAsset.setAddlInfo(addl);
					System.out.println("addlInfo " + addl);
				}
				
				imgInfoTnx = new PictureAndQRInfoTnx();
				imgInfoTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(falst.get(i));				
				if (imgInfoTnx != null) {
					falst.get(i).setImgInfoTnx(imgInfoTnx);
					// PictureAndQRInfo imgInfo = this.swapPictureAndQRInfo(falst.get(i));
					PictureAndQRInfo img = new PictureAndQRInfo();
					img.setPictureAndQrTnxSeqId(falst.get(i).getImgInfoTnx().getPictureAndQrTnxSeqId());
					img.setEntity(falst.get(i).getEntity());
					img.setProductCode(falst.get(i).getProductCode());
					img.setProdRefId(falst.get(i).getProdRefId());
					img.setBusinessDate(new Date());
					img.setTrackingCode(falst.get(i).getImgInfoTnx().getTrackingCode());
					img.setTrackingFileName(falst.get(i).getImgInfoTnx().getTrackingFileName());
					img.setTrackingFileLocation(falst.get(i).getImgInfoTnx().getTrackingFileLocation());
					img.setTrackingCreateDate(new Date());
					img.setVerifiedCode(falst.get(i).getImgInfoTnx().getVerifiedCode());
					img.setVerifiedFileName(falst.get(i).getImgInfoTnx().getVerifiedFileName());
					img.setVerifiedFileLocation(falst.get(i).getImgInfoTnx().getVerifiedFileLocation());
					img.setVerifiedDate(new Date());
					img.setPictureCode(falst.get(i).getImgInfoTnx().getPictureCode());
					img.setPictureFileName(falst.get(i).getImgInfoTnx().getPictureFileName());
					img.setPictureFileLocation(falst.get(i).getImgInfoTnx().getPictureFileLocation());
					img.setPictureCaptureDate(new Date());					
					fixedAsset.setImgInfo(img);
					System.out.println("img " + img);
				}
				
				System.out.println("fixedAsset " + fixedAsset);
				fixedAssetList.add(fixedAsset);
			}
			
		}
		
		return fixedAssetList;
	}

	@Override
	public FixedAssetTnx saveAsDraftForUpdate(FixedAssetTnx fixedAssetTnx) throws FamApplicationException {
		
		 System.out.println("**********************Parameter*********************** "+ fixedAssetTnx);
		 FixedAssetAdditionalInfoTnx addlInfoTnx = fixedAssetTnx.getAddlInfoTnx();
		 PictureAndQRInfoTnx pcQRInfoTnx = fixedAssetTnx.getImgInfoTnx();
		 String fixedAssetTnxSeqId = fixedAssetTnx.getFixedAssetTnxSeqId();
		 String prodRefId = fixedAssetTnx.getProdRefId();
		 String fixedAssetMstSeqId = fixedAssetTnx.getFixedAsset().getFixedAssetMstSeqId();
		
		 List<FixedAssetTnx>  ftTnxLst = fixedAssetTnxRepository.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId,Common.TNX_STATUS_CODE[0],Common.TNX_TYPE[2],Common.TNX_SUB_TYPE[5]);
		 FixedAssetTnx ftTnx = null;
	
		 if(ftTnxLst.size() != 0) {
			 ftTnx = ftTnxLst.get(0);
		 }
		 
		 fixedAssetTnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		 fixedAssetTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[0]);
		 fixedAssetTnx.setTnxType(Common.TNX_TYPE[2]);
		 fixedAssetTnx.setTnxSubType(Common.TNX_SUB_TYPE[5]);
		 fixedAssetTnx.setBusinessDate(new Date());
		 fixedAssetTnx.setInputDate(new Date());
		 fixedAssetTnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		 
		 String branchCode = fixedAssetTnx.getBranchCode();
		 String vendorCode = fixedAssetTnx.getVendorCode();
		 String depCode = fixedAssetTnx.getDeptCode();
		
		 CodeValue brnCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(branchCode);
		 CodeValue vendorCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(vendorCode);
		 CodeValue depCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(depCode);
		 
		 if(brnCodeValue == null) {
			 
			 throw new FamApplicationException(brnCodeValue + " Record Not Found in Mst.");
		 }
		 if(vendorCodeValue == null) {
			
			 throw new FamApplicationException(vendorCodeValue + " Record Not Found in Mst.");
		 }
		 if(depCodeValue == null) {
			
			 throw new FamApplicationException(depCodeValue + " Record Not Found in Mst.");
		 }
		
		 System.out.println("**********************Parameter*********************** "+ fixedAssetTnx);
		 System.out.println("**********************Parameter*********************** "+ ftTnx);
				
		 if(ftTnx == null) {
				
			 fixedAssetTnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			 Task task = this.startPendingTask(fixedAssetTnx);
			 fixedAssetTnx.setTaskId(task.getId());
			 fixedAssetTnx.setTaskName(task.getName());
			 FixedAssetTnx saveFixedAssetTnxData = fixedAssetTnxRepository.save(fixedAssetTnx);
			
			 if(addlInfoTnx != null) {
			      
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				    
				   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 
				 if(pcQRInfoTnx != null) {
				   
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			 return saveFixedAssetTnxData;
		
		 }else {
			 
			FixedAssetTnx saveFixedAssetTnxData = this.passByReferencyForFixedAssetTnxBean(ftTnx, fixedAssetTnx);
			 if(addlInfoTnx != null) {
			
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				   System.out.println("*******************Additional Information**************"+ftTnx);
				   System.out.println("*******************Additional Information**************"+fixedAssetTnx);
				   System.out.println("*******************Additional Information**************"+adInfoTnx);
				   List<FixedAssetAdditionalInfoTnx> addlTnxLst = fixedAssetAdditionalInfoTnxRepository.findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId
						   (prodRefId,adInfoTnx.getFixedAssetAdditionalInfo().getFixedAssetAddlMstSeqId(),
						   saveFixedAssetTnxData.getFixedAssetTnxSeqId());
				  // String addlInfoTnxSeqId = addlInfoTnx.getFixedAssetAddlTnxSeqId();
				   System.out.println("*******************Find BY Additional Information**************"+adInfoTnx);
				   FixedAssetAdditionalInfoTnx addlTnxInfoData = null;
				   if(addlTnxLst.size() > 0) {
					    addlTnxInfoData = addlTnxLst.get(0); 
				   }
				   
				   if(addlTnxInfoData == null) {
					   
					   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
					      
				   }
				   System.out.println("Additional Info Tnx &&&&&&&&&&&&&&&&&&&&" + addlInfoTnx);
				   addlInfoTnx.setBusinessDate(new Date());
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   addlInfoTnx.setFixedAssetTnx(saveFixedAssetTnxData);
				   addlInfoTnx.setTaskId(saveFixedAssetTnxData.getTaskId());
				   //addlInfoTnx.setFixedAssetAdditionalInfo(ftTnx.getFixedAsset().getAddlInfo());
				   addlInfoTnx.setFixedAssetAdditionalInfo(adInfoTnx.getFixedAssetAdditionalInfo());
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 if(pcQRInfoTnx != null) {
				 
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			
				 return saveFixedAssetTnxData;
		 }
		 
		 
		 
	}
	
	
	@Override
	public FixedAssetTnx completeForUpdate(FixedAssetTnx fixedAssetTnx) throws FamApplicationException {

		 FixedAssetAdditionalInfoTnx addlInfoTnx = fixedAssetTnx.getAddlInfoTnx();
		 PictureAndQRInfoTnx pcQRInfoTnx = fixedAssetTnx.getImgInfoTnx();
		 String fixedAssetTnxSeqId = fixedAssetTnx.getFixedAssetTnxSeqId();
		 String prodRefId = fixedAssetTnx.getProdRefId();
		 String fixedAssetMstSeqId = fixedAssetTnx.getFixedAsset().getFixedAssetMstSeqId();
		 
		 System.out.println("^^^^^^^^^^^^^^^^^^"+prodRefId);
		 System.out.println("%%%%%%%%%%%%%%%%%%"+fixedAssetMstSeqId);
		 List<FixedAssetTnx>  ftTnxLst = fixedAssetTnxRepository.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId);
		 FixedAssetTnx ftTnx = null;
	
		 if(ftTnxLst.size() != 0) {
			 ftTnx = ftTnxLst.get(0);
		 }
		 
		 fixedAssetTnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		 fixedAssetTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[0]);
		 fixedAssetTnx.setTnxType(Common.TNX_TYPE[2]);
		 fixedAssetTnx.setTnxSubType(Common.TNX_SUB_TYPE[6]);
		 fixedAssetTnx.setBusinessDate(new Date());
		 fixedAssetTnx.setInputDate(new Date());
		 fixedAssetTnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		 
		 String branchCode = fixedAssetTnx.getBranchCode();
		 String vendorCode = fixedAssetTnx.getVendorCode();
		 String depCode = fixedAssetTnx.getDeptCode();
		
		 CodeValue brnCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(branchCode);
		 CodeValue vendorCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(vendorCode);
		 CodeValue depCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(depCode);
		 
		 if(brnCodeValue == null) {
			 
			 throw new FamApplicationException(brnCodeValue + " Record Not Found in Mst.");
		 }
		 if(vendorCodeValue == null) {
			
			 throw new FamApplicationException(vendorCodeValue + " Record Not Found in Mst.");
		 }
		 if(depCodeValue == null) {
			
			 throw new FamApplicationException(depCodeValue + " Record Not Found in Mst.");
		 }
		
		 
		 if(ftTnx == null) {
				
			 fixedAssetTnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			 Task task = this.startUpdateTask(fixedAssetTnx);
			 fixedAssetTnx.setTaskId(task.getId());
			 fixedAssetTnx.setTaskName(task.getName());
			 FixedAssetTnx saveFixedAssetTnxData = fixedAssetTnxRepository.save(fixedAssetTnx);
			 FixedAssetAdditionalInfo addlInfoMst  = fixedAssetAdditionalInfoRepository.findByProdRefId(fixedAssetTnx.getProdRefId());
			 if(addlInfoTnx != null) {
			      
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				    System.out.println("Additional Info Tnx Information^^^^^^^^^^^^^^^^^^^^^^^^" + addlInfoTnx.toString());
				   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   addlInfoTnx.setFixedAssetAdditionalInfo(addlInfoMst);
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 
				 if(pcQRInfoTnx != null) {
				   
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			 return saveFixedAssetTnxData;
		
		 }else {
			 
			FixedAssetTnx saveFixedAssetTnxData = this.passByReferencyUpdateForFixedAssetTnxBean(ftTnx, fixedAssetTnx);
//			 if(addlInfoTnx != null) {
//			
//				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
//				   String addlInfoTnxSeqId = addlInfoTnx.getFixedAssetAddlTnxSeqId();
//				   FixedAssetAdditionalInfo addlInfoMst  = fixedAssetAdditionalInfoRepository.findByProdRefId(fixedAssetTnx.getProdRefId());
//				   
//				   if(addlInfoTnxSeqId == null) {
//					   
//					   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
//					      
//				   }
//				   
//				   
//				   
//				   addlInfoTnx.setBusinessDate(new Date());
//				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
//				   addlInfoTnx.setFixedAssetTnx(saveFixedAssetTnxData);
//				   addlInfoTnx.setFixedAssetAdditionalInfo(addlInfoMst);
//				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
//				   
//				 }
			 
			 if(addlInfoTnx != null) {
					
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				   List<FixedAssetAdditionalInfoTnx> addlTnxLst = fixedAssetAdditionalInfoTnxRepository.findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId
						   (prodRefId,adInfoTnx.getFixedAssetAdditionalInfo().getFixedAssetAddlMstSeqId(),
						   saveFixedAssetTnxData.getFixedAssetTnxSeqId());
				
				   FixedAssetAdditionalInfoTnx addlTnxInfoData = null;
				   if(addlTnxLst.size() > 0) {
					    addlTnxInfoData = addlTnxLst.get(0); 
				   }
				   
				   if(addlTnxInfoData == null) {
					   
					   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
					      
				   }
				 
				   addlInfoTnx.setBusinessDate(new Date());
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   addlInfoTnx.setFixedAssetTnx(saveFixedAssetTnxData);
				   addlInfoTnx.setTaskId(saveFixedAssetTnxData.getTaskId());
				   addlInfoTnx.setFixedAssetAdditionalInfo(adInfoTnx.getFixedAssetAdditionalInfo());
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 if(pcQRInfoTnx != null) {
				 
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			
				 return saveFixedAssetTnxData;
		 }
		 
		 
		 
	}

	@Override
	public List<FixedAssetTnx> findAllByProdRefIdAndFixedAssetMstSeqId(String prodRefId, String fixedAssetMstSeqId)
			throws FamApplicationException {
		// TODO Auto-generated method stub
		return fixedAssetTnxRepository.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId);
	}
	
	@Override
	public List<FixedAssetAdditionalInfoTnx> findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId(
			String prodRefId, String fixedAssetAddlMstSeqId, String fixedAssetTnxSeqId) throws FamApplicationException {
		
		return fixedAssetAdditionalInfoTnxRepository.findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId(prodRefId, fixedAssetAddlMstSeqId, fixedAssetTnxSeqId);
	}
	
	

	@Override
	public List<FixedAssetAdditionalInfoTnx> findAllByProdRefIdAndFixedAssetAddlMstSeqId(String prodRefId,
			String fixedAssetAddlMstSeqId) throws FamApplicationException {
		// TODO Auto-generated method stub
		return fixedAssetAdditionalInfoTnxRepository.findAllByProdRefIdAndFixedAssetAddlMstSeqId(prodRefId, fixedAssetAddlMstSeqId);
	}

	
	@Transactional("transactionManager")
	public FixedAssetTnx passByReferencyForFixedAssetTnxBean(FixedAssetTnx passByReferencyTnx,FixedAssetTnx fixedAssetTnx) {
	     
		FixedAssetTnx tnx = new FixedAssetTnx();
		
	    tnx.setEntity(fixedAssetTnx.getEntity());
		tnx.setFixedAssetTnxSeqId(passByReferencyTnx.getFixedAssetTnxSeqId());
		tnx.setProdRefId(passByReferencyTnx.getProdRefId());
		tnx.setProductCode(fixedAssetTnx.getProductCode());
		tnx.setAssetType(fixedAssetTnx.getAssetType());
		tnx.setAssetSubType(fixedAssetTnx.getAssetSubType());
		tnx.setBusinessDate(new Date());
		tnx.setInvoiceDate(fixedAssetTnx.getInvoiceDate());
		tnx.setInvoiceRef(fixedAssetTnx.getInvoiceRef());
		tnx.setInvUnitPrice(fixedAssetTnx.getInvUnitPrice());
		tnx.setInvQuantity(fixedAssetTnx.getInvQuantity());
		tnx.setInvCurrency(fixedAssetTnx.getInvCurrency());
		tnx.setInvAmount(fixedAssetTnx.getInvAmount());
		tnx.setExchRate(fixedAssetTnx.getExchRate());
		tnx.setTnxCurrency(fixedAssetTnx.getTnxCurrency());
		tnx.setTnxAmount(fixedAssetTnx.getTnxAmount());
		tnx.setBookCurrency(fixedAssetTnx.getBookCurrency());
		tnx.setBookAmt(fixedAssetTnx.getBookAmt());
		tnx.setPurchaseDate(new Date());
		tnx.setAssetDesc1(fixedAssetTnx.getAssetDesc1());
		tnx.setAssetDesc2(fixedAssetTnx.getAssetDesc2());
		tnx.setAssetModel(fixedAssetTnx.getAssetModel());
		tnx.setSerialNo(fixedAssetTnx.getSerialNo());
		tnx.setUniqueId(fixedAssetTnx.getUniqueId());
		tnx.setAssetQuantity(fixedAssetTnx.getAssetQuantity());			
		tnx.setBranchCode(fixedAssetTnx.getBranchCode());
		tnx.setDeptCode(fixedAssetTnx.getDeptCode());
		tnx.setDepMethod(fixedAssetTnx.getDepMethod());
		tnx.setDepRate(fixedAssetTnx.getDepRate());
		tnx.setDepUsefulLife(fixedAssetTnx.getDepUsefulLife());
		tnx.setDepCollFrequency(fixedAssetTnx.getDepCollFrequency());
		tnx.setResidualCurrency(fixedAssetTnx.getResidualCurrency());
		tnx.setResidualValue(fixedAssetTnx.getResidualValue());
		tnx.setAccumDepCurrency(fixedAssetTnx.getAccumDepCurrency());
		tnx.setAccumDepAmt(fixedAssetTnx.getAccumDepAmt());	
		tnx.setDepSequence(0);
		tnx.setNetAssetCurrency(fixedAssetTnx.getNetAssetCurrency());
		tnx.setNetAssetAmount(fixedAssetTnx.getNetAssetAmount());
		tnx.setVendorCode(fixedAssetTnx.getVendorCode());
		tnx.setVendorName(fixedAssetTnx.getVendorName());
		tnx.setPurchaseDate(fixedAssetTnx.getPurchaseDate());
		tnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		tnx.setTnxStatusCode(Common.TNX_STATUS_CODE[0]);
		tnx.setTnxType(Common.TNX_TYPE[2]);
		tnx.setTnxSubType(Common.TNX_SUB_TYPE[5]);
		tnx.setBusinessDate(new Date());
		tnx.setInputDate(new Date());
		tnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		tnx.setFixedAsset(fixedAssetTnx.getFixedAsset()); 
		tnx.setTaskId(passByReferencyTnx.getTaskId());
		tnx.setTaskName(passByReferencyTnx.getTaskName());
		System.out.println("New Updated Tnx%%%%%%%%%%%$$$$$$$$$$$$$$$$$"+passByReferencyTnx);
		System.out.println("New Updated Tnx new Tnx%%%%%%%%%%%$$$$$$$$$$$$$$$$$"+ tnx);
		return fixedAssetTnxRepository.save(tnx);
	}
    
	@Transactional("transactionManager")
	public FixedAssetTnx passByReferencyUpdateForFixedAssetTnxBean(FixedAssetTnx passByReferencyTnx,FixedAssetTnx fixedAssetTnx) {
	     
		FixedAssetTnx tnx = new FixedAssetTnx();
		
	    tnx.setEntity(fixedAssetTnx.getEntity());
	    
	    if(passByReferencyTnx.getTnxStatusCode().equals(Common.TNX_STATUS_CODE[2])) {
	    	tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
	    }else {
	    	tnx.setFixedAssetTnxSeqId(passByReferencyTnx.getFixedAssetTnxSeqId());
	    }
	    	 
		
		tnx.setProdRefId(passByReferencyTnx.getProdRefId());
		tnx.setProductCode(fixedAssetTnx.getProductCode());
		tnx.setAssetType(fixedAssetTnx.getAssetType());
		tnx.setAssetSubType(fixedAssetTnx.getAssetSubType());
		tnx.setBusinessDate(new Date());
		tnx.setInvoiceDate(fixedAssetTnx.getInvoiceDate());
		tnx.setInvoiceRef(fixedAssetTnx.getInvoiceRef());
		tnx.setInvUnitPrice(fixedAssetTnx.getInvUnitPrice());
		tnx.setInvQuantity(fixedAssetTnx.getInvQuantity());
		tnx.setInvCurrency(fixedAssetTnx.getInvCurrency());
		tnx.setInvAmount(fixedAssetTnx.getInvAmount());
		tnx.setExchRate(fixedAssetTnx.getExchRate());
		tnx.setTnxCurrency(fixedAssetTnx.getTnxCurrency());
		tnx.setTnxAmount(fixedAssetTnx.getTnxAmount());
		tnx.setBookCurrency(fixedAssetTnx.getBookCurrency());
		tnx.setBookAmt(fixedAssetTnx.getBookAmt());
		tnx.setPurchaseDate(new Date());
		tnx.setAssetDesc1(fixedAssetTnx.getAssetDesc1());
		tnx.setAssetDesc2(fixedAssetTnx.getAssetDesc2());
		tnx.setAssetModel(fixedAssetTnx.getAssetModel());
		tnx.setSerialNo(fixedAssetTnx.getSerialNo());
		tnx.setUniqueId(fixedAssetTnx.getUniqueId());
		tnx.setAssetQuantity(fixedAssetTnx.getAssetQuantity());			
		tnx.setBranchCode(fixedAssetTnx.getBranchCode());
		tnx.setDeptCode(fixedAssetTnx.getDeptCode());
		tnx.setDepMethod(fixedAssetTnx.getDepMethod());
		tnx.setDepRate(fixedAssetTnx.getDepRate());
		tnx.setDepUsefulLife(fixedAssetTnx.getDepUsefulLife());
		tnx.setDepCollFrequency(fixedAssetTnx.getDepCollFrequency());
		tnx.setResidualCurrency(fixedAssetTnx.getResidualCurrency());
		tnx.setResidualValue(fixedAssetTnx.getResidualValue());
		tnx.setAccumDepCurrency(fixedAssetTnx.getAccumDepCurrency());
		tnx.setAccumDepAmt(fixedAssetTnx.getAccumDepAmt());	
		tnx.setDepSequence(0);
		tnx.setNetAssetCurrency(fixedAssetTnx.getNetAssetCurrency());
		tnx.setNetAssetAmount(fixedAssetTnx.getNetAssetAmount());
		tnx.setVendorCode(fixedAssetTnx.getVendorCode());
		tnx.setVendorName(fixedAssetTnx.getVendorName());
		tnx.setPurchaseDate(fixedAssetTnx.getPurchaseDate());
		tnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		tnx.setTnxStatusCode(Common.TNX_STATUS_CODE[1]);
		tnx.setTnxType(Common.TNX_TYPE[2]);
		tnx.setTnxSubType(Common.TNX_SUB_TYPE[5]);
		tnx.setBusinessDate(new Date());
		tnx.setInputDate(new Date());
		tnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		tnx.setFixedAsset(fixedAssetTnx.getFixedAsset()); 
		tnx.setArchiveFlag(passByReferencyTnx.getArchiveFlag());
		tnx.setAssetTracking(fixedAssetTnx.getAssetTracking());
		
//		if(passByReferencyTnx.getTaskName() == "SaveAsDraft") {
//			this.endPendingTask(passByReferencyTnx.getTaskId());
//		}
		
		//Task task = this.startUpdateTask(passByReferencyTnx);
		tnx.setTaskId(passByReferencyTnx.getTaskId());
		tnx.setTaskName(passByReferencyTnx.getTaskName());
		System.out.println("New Updated Tnx%%%%%%%%%%%$$$$$$$$$$$$$$$$$"+passByReferencyTnx);
		System.out.println("New Updated Tnx new Tnx%%%%%%%%%%%$$$$$$$$$$$$$$$$$"+ tnx);
		return fixedAssetTnxRepository.save(tnx);
	}
	
	@Override
	public List<FixedAssetTnx> getPendingTasks(String assignee) {
				List<FixedAssetTnx> txnList = new ArrayList<FixedAssetTnx>();
				List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("faupdateprocess").list();
				//List<Task> taskList =  taskService.createTaskQuery().processInstanceId("faupdateprocess").list();
				for (Task task : taskList) {
					System.out.println(task.toString());
					FixedAssetTnx fixedAssetTnx = new FixedAssetTnx();
				   // System.out.println("*********************************"+fixedAssetTnxRepository.findByTaskIdAndTaskName(task.getId(),task.getName()));
					fixedAssetTnx = fixedAssetTnxRepository.findByTaskIdAndTaskName(task.getId(),task.getName());
					if(fixedAssetTnx != null) {
						fixedAssetTnx.setTaskId(task.getId());
						txnList.add(fixedAssetTnx);
					}
					
					
				}
				return txnList;
		
		
	}

	@Override
	public List<FixedAssetTnx> getPendingDisposeTasks(String assignee) {
				List<FixedAssetTnx> txnList = new ArrayList<FixedAssetTnx>();
				List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("fadisposeprocess").list();
				//List<Task> taskList =  taskService.createTaskQuery().processInstanceId("faupdateprocess").list();
				for (Task task : taskList) {
					System.out.println(task.toString());
					FixedAssetTnx fixedAssetTnx = new FixedAssetTnx();
				   // System.out.println("*********************************"+fixedAssetTnxRepository.findByTaskIdAndTaskName(task.getId(),task.getName()));
					fixedAssetTnx = fixedAssetTnxRepository.findByTaskIdAndTaskName(task.getId(),task.getName());
					if(fixedAssetTnx != null) {
						fixedAssetTnx.setTaskId(task.getId());
						txnList.add(fixedAssetTnx);
					}
					
					
				}
				return txnList;
		
		
	}
	
	@Override
	public List<FixedAssetTnx> getCompletingTasks(String assignee) {
		List<FixedAssetTnx> txnList = new ArrayList<FixedAssetTnx>();
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("faupdateprocess").list();
		//List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).active().list();
		System.out.println("Task List *********************" + taskList.toString());
		for (Task task : taskList) {
							
			FixedAssetTnx fixedAssetTnx = new FixedAssetTnx();
		    System.out.println("*********************************"+fixedAssetTnxRepository.findByTaskIdAndTaskName(task.getId(),task.getName()));
			fixedAssetTnx = fixedAssetTnxRepository.findByTaskIdAndTaskName(task.getId(),task.getName());
			
			if(fixedAssetTnx != null) {
			
				fixedAssetTnx.setTaskId(task.getId());
				txnList.add(fixedAssetTnx);
			}
			
		}
		return txnList;
	}

	
	@Override
	@Transactional("transactionManager")
	public FixedAsset completeRegister(FixedAsset fixedAsset) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		FixedAsset checkFixedAsset = fixedAssetRepository.findByProdRefId(fixedAsset.getProdRefId());		
		
		System.out.println("check fixed asset " + checkFixedAsset);
		
		if (checkFixedAsset == null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				fixedAsset.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			FixedAssetTnx tnx = fixedAssetTnxRepository.findByProdRefIdAndTnxStatusCode(fixedAsset.getProdRefId(), "01");
			if (tnx == null) {
				
				tnx = new FixedAssetTnx();
				tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			}	
			tnx.setEntity(fixedAsset.getEntity());
			tnx.setProductCode(fixedAsset.getProductCode());
			tnx.setAssetType(fixedAsset.getAssetType());
			tnx.setAssetSubType(fixedAsset.getAssetSubType());
			tnx.setProdRefId(fixedAsset.getProdRefId());
			tnx.setBusinessDate(new Date());
			tnx.setInvoiceDate(fixedAsset.getInvoiceDate());
			tnx.setInvoiceRef(fixedAsset.getInvoiceRef());
			tnx.setInvUnitPrice(fixedAsset.getInvUnitPrice());
			tnx.setInvQuantity(fixedAsset.getInvQuantity());
			tnx.setInvCurrency(fixedAsset.getInvCurrency());
			tnx.setInvAmount(fixedAsset.getInvAmount());
			tnx.setExchRate(fixedAsset.getExchRate());
			tnx.setTnxCurrency(fixedAsset.getTnxCurrency());
			tnx.setTnxAmount(fixedAsset.getTnxAmount());
			tnx.setBookCurrency(fixedAsset.getBookCurrency());
			tnx.setBookAmt(fixedAsset.getBookAmt());
			tnx.setPurchaseDate(fixedAsset.getPurchaseDate());
			tnx.setAssetDesc1(fixedAsset.getAssetDesc1());
			tnx.setAssetDesc2(fixedAsset.getAssetDesc2());
			tnx.setAssetModel(fixedAsset.getAssetModel());
			tnx.setSerialNo(fixedAsset.getSerialNo());
			tnx.setUniqueId(fixedAsset.getUniqueId());
			tnx.setAssetQuantity(fixedAsset.getAssetQuantity());			
			tnx.setBranchCode(fixedAsset.getBranchCode());
			tnx.setDeptCode(fixedAsset.getDeptCode());
			tnx.setDepMethod(fixedAsset.getDepMethod());
			tnx.setDepRate(fixedAsset.getDepRate());
			tnx.setDepUsefulLife(fixedAsset.getDepUsefulLife());
			tnx.setDepCollFrequency(fixedAsset.getDepCollFrequency());
			tnx.setResidualCurrency(fixedAsset.getResidualCurrency());
			tnx.setResidualValue(fixedAsset.getResidualValue());
			tnx.setAccumDepCurrency(fixedAsset.getAccumDepCurrency());
			tnx.setAccumDepAmt(fixedAsset.getAccumDepAmt());	
			tnx.setDepSequence(0);
			tnx.setNetAssetCurrency(fixedAsset.getNetAssetCurrency());
			tnx.setNetAssetAmount(fixedAsset.getNetAssetAmount());
			tnx.setVendorCode(fixedAsset.getVendorCode());
			tnx.setVendorName(fixedAsset.getVendorName());
			tnx.setProdStatusCode("01");
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			tnx.setAssetTracking(fixedAsset.getAssetTracking());
			fixedAssetTnxRepository.save(tnx);
			
			FixedAssetAdditionalInfoTnx addlTnx = null;
			if (fixedAsset.getAddlInfo() != null) {
				
				addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);
				if (addlTnx == null) {
					addlTnx = new FixedAssetAdditionalInfoTnx();					
					addlTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));			
				} 	
				addlTnx.setEntity(fixedAsset.getEntity());
				addlTnx.setProductCode(fixedAsset.getProductCode());
				addlTnx.setProdRefId(fixedAsset.getProdRefId());
				addlTnx.setBusinessDate(new Date());
				addlTnx.setNote1(fixedAsset.getAddlInfo().getNote1());
				addlTnx.setNote2(fixedAsset.getAddlInfo().getNote2());
				addlTnx.setNote3(fixedAsset.getAddlInfo().getNote3());
				addlTnx.setNote4(fixedAsset.getAddlInfo().getNote4());
				addlTnx.setInsuranceName(fixedAsset.getAddlInfo().getInsuranceName());
				addlTnx.setInsuranceCode(fixedAsset.getAddlInfo().getInsuranceCode());
				addlTnx.setInsuranceType(fixedAsset.getAddlInfo().getInsuranceType());
				addlTnx.setInsuranceFrom(fixedAsset.getAddlInfo().getInsuranceFrom());
				addlTnx.setInsuranceTo(fixedAsset.getAddlInfo().getInsuranceTo());
				addlTnx.setWarrantyName(fixedAsset.getAddlInfo().getWarrantyName());
				addlTnx.setWarrantyCode(fixedAsset.getAddlInfo().getWarrantyCode());
				addlTnx.setWarrantyType(fixedAsset.getAddlInfo().getWarrantyType());
				addlTnx.setWarrantyFrom(fixedAsset.getAddlInfo().getWarrantyFrom());
				addlTnx.setWarrantyTo(fixedAsset.getAddlInfo().getWarrantyTo());
				addlTnx.setSupportName(fixedAsset.getAddlInfo().getSupportName());
				addlTnx.setSupportCode(fixedAsset.getAddlInfo().getSupportCode());
				addlTnx.setSupportType(fixedAsset.getAddlInfo().getSupportType());
				addlTnx.setSupportFrom(fixedAsset.getAddlInfo().getSupportFrom());
				addlTnx.setSupportTo(fixedAsset.getAddlInfo().getSupportTo());
				addlTnx.setTaxType(fixedAsset.getAddlInfo().getTaxType());
				addlTnx.setTaxName(fixedAsset.getAddlInfo().getTaxName());
				addlTnx.setTaxRate(fixedAsset.getAddlInfo().getTaxRate());
				addlTnx.setTaxCurrency(fixedAsset.getAddlInfo().getTaxCurrency());
				addlTnx.setTaxAmount(fixedAsset.getAddlInfo().getTaxAmount());
				addlTnx.setFinanceType(fixedAsset.getAddlInfo().getFinanceType());
				addlTnx.setFinanceCode(fixedAsset.getAddlInfo().getFinanceCode());
				addlTnx.setFinanceName(fixedAsset.getAddlInfo().getFinanceName());
				addlTnx.setFinanceCurrency(fixedAsset.getAddlInfo().getFinanceCurrency());
				addlTnx.setFinanceAmt(fixedAsset.getAddlInfo().getFinanceAmt());
				addlTnx.setRate(fixedAsset.getAddlInfo().getRate());
				addlTnx.setFinanceFrom(fixedAsset.getAddlInfo().getFinanceFrom());
				addlTnx.setFinanceTo(fixedAsset.getAddlInfo().getFinanceTo());
				addlTnx.setFixedAssetTnx(tnx);
				fixedAssetAdditionalInfoTnxRepository.save(addlTnx);			
			}
			
			PictureAndQRInfoTnx imgTnx = null;			
			if (fixedAsset.getImgInfo() != null) {
				
				imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
				if (imgTnx == null) {					
					imgTnx = new PictureAndQRInfoTnx();
					imgTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
				} 
				imgTnx.setEntity(fixedAsset.getEntity());
				imgTnx.setProductCode(fixedAsset.getProductCode());
				imgTnx.setProdRefId(fixedAsset.getProdRefId());
				imgTnx.setBusinessDate(new Date());
				imgTnx.setTrackingCode(fixedAsset.getImgInfo().getTrackingCode());
				imgTnx.setTrackingFileName(fixedAsset.getImgInfo().getTrackingFileName());
				imgTnx.setTrackingFileLocation(fixedAsset.getImgInfo().getTrackingFileLocation());
				imgTnx.setTrackingCreateDate(new Date());
				imgTnx.setVerifiedCode(fixedAsset.getImgInfo().getVerifiedCode());
				imgTnx.setVerifiedFileName(fixedAsset.getImgInfo().getVerifiedFileName());
				imgTnx.setVerifiedFileLocation(fixedAsset.getImgInfo().getVerifiedFileLocation());
				imgTnx.setVerifiedDate(new Date());
				imgTnx.setPictureCode(fixedAsset.getImgInfo().getPictureCode());
				imgTnx.setPictureFileName(fixedAsset.getImgInfo().getPictureFileName());
				imgTnx.setPictureFileLocation(fixedAsset.getImgInfo().getPictureFileLocation());
				imgTnx.setPictureCaptureDate(new Date());
				imgTnx.setFixedAssetTnx(tnx);
				
				pictureAndQRInfoTnxRepository.save(imgTnx);
			}
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Product " + fixedAsset.getProdRefId() + " is saved as draft."));
			apiMsg.setMessage("Product " + fixedAsset.getProdRefId() + " is saved as draft.");
			
		} else {			
			FixedAsset errFa = new FixedAsset();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Duplicate Branch Code."));
			err.setMessage("Product " + fixedAsset.getProdRefId() + " already exist.");
			// fixedAsset.setApiError(err);
			
			throw new FamApplicationException("Product " + fixedAsset.getProdRefId() + " already exist.");
		}
		return fixedAsset;
	}

	@Override
	public List<FixedAssetTnx> findByProdRefIdAndFixedAssetMstSeqId(String prodRefId, String fixedAssetMstSeqId,
			String tnxStatusCode, String tnxType, String tnxSubType) throws FamApplicationException {
		
		return fixedAssetTnxRepository.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId,tnxStatusCode,tnxType,tnxSubType);
		
	}

	@Override
	public List<FixedAssetTnx> findAllByTnxStatusCodeAndTnxType(String tnxStatusCode, String tnxType) {
		// TODO Auto-generated method stub
		return fixedAssetTnxRepository.findAllByTnxStatusCodeAndTnxType(tnxStatusCode, tnxType);
	}

	
	
	@Override
	public FixedAssetTnx saveAsDraftForDispose(FixedAssetTnx fixedAssetTnx) throws FamApplicationException {
		
		 System.out.println("**********************Parameter*********************** "+ fixedAssetTnx);
		 FixedAssetAdditionalInfoTnx addlInfoTnx = fixedAssetTnx.getAddlInfoTnx();
		 PictureAndQRInfoTnx pcQRInfoTnx = fixedAssetTnx.getImgInfoTnx();
		 String fixedAssetTnxSeqId = fixedAssetTnx.getFixedAssetTnxSeqId();
		 String prodRefId = fixedAssetTnx.getProdRefId();
		 String fixedAssetMstSeqId = fixedAssetTnx.getFixedAsset().getFixedAssetMstSeqId();
		
		 List<FixedAssetTnx>  ftTnxLst = fixedAssetTnxRepository.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId,Common.TNX_STATUS_CODE[0],Common.TNX_TYPE[2],Common.TNX_SUB_TYPE[5]);
		 FixedAssetTnx ftTnx = null;
	
		 if(ftTnxLst.size() != 0) {
			 ftTnx = ftTnxLst.get(0);
		 }
		 
		 fixedAssetTnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		 fixedAssetTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[0]);
		 fixedAssetTnx.setTnxType(Common.TNX_TYPE[3]);
		 fixedAssetTnx.setTnxSubType(fixedAssetTnx.getDisposeType());
		 fixedAssetTnx.setBusinessDate(new Date());
		 fixedAssetTnx.setInputDate(new Date());
		 fixedAssetTnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		 
		 String branchCode = fixedAssetTnx.getBranchCode();
		 String vendorCode = fixedAssetTnx.getVendorCode();
		 String depCode = fixedAssetTnx.getDeptCode();
		
		 CodeValue brnCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(branchCode);
		 CodeValue vendorCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(vendorCode);
		 CodeValue depCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(depCode);
		 
		 if(brnCodeValue == null) {
			 
			 throw new FamApplicationException(brnCodeValue + " Record Not Found in Mst.");
		 }
		 if(vendorCodeValue == null) {
			
			 throw new FamApplicationException(vendorCodeValue + " Record Not Found in Mst.");
		 }
		 if(depCodeValue == null) {
			
			 throw new FamApplicationException(depCodeValue + " Record Not Found in Mst.");
		 }
		
		 
		 if(ftTnx == null) {
				
			 fixedAssetTnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			 Task task = this.startPendingDisposeTask(fixedAssetTnx);
			 fixedAssetTnx.setTaskId(task.getId());
			 fixedAssetTnx.setTaskName(task.getName());
			 FixedAssetTnx saveFixedAssetTnxData = fixedAssetTnxRepository.save(fixedAssetTnx);
			
			 if(addlInfoTnx != null) {
			      
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				    
				   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 
				 if(pcQRInfoTnx != null) {
				   
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			 return saveFixedAssetTnxData;
		
		 }else {
			 
			FixedAssetTnx saveFixedAssetTnxData = this.passByReferencyForDisposeFixedAssetTnxBean(ftTnx, fixedAssetTnx);
			 if(addlInfoTnx != null) {
			
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				   System.out.println("*******************Additional Dispose Information**************"+ftTnx);
				   System.out.println("*******************Additional Dispose Information**************"+fixedAssetTnx);
				   System.out.println("*******************Additional Dispose Information**************"+adInfoTnx);
				   List<FixedAssetAdditionalInfoTnx> addlTnxLst = fixedAssetAdditionalInfoTnxRepository.findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId
						   (prodRefId,adInfoTnx.getFixedAssetAdditionalInfo().getFixedAssetAddlMstSeqId(),
						   saveFixedAssetTnxData.getFixedAssetTnxSeqId());
				  // String addlInfoTnxSeqId = addlInfoTnx.getFixedAssetAddlTnxSeqId();
				   System.out.println("*******************Find BY Additional Information**************"+adInfoTnx);
				   FixedAssetAdditionalInfoTnx addlTnxInfoData = null;
				   if(addlTnxLst.size() > 0) {
					    addlTnxInfoData = addlTnxLst.get(0); 
				   }
				   
				   if(addlTnxInfoData == null) {
					   
					   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
					      
				   }
				   System.out.println("Additional Info Tnx &&&&&&&&&&&&&&&&&&&&" + addlInfoTnx);
				   addlInfoTnx.setBusinessDate(new Date());
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   addlInfoTnx.setFixedAssetTnx(saveFixedAssetTnxData);
				   addlInfoTnx.setTaskId(saveFixedAssetTnxData.getTaskId());
				   //addlInfoTnx.setFixedAssetAdditionalInfo(ftTnx.getFixedAsset().getAddlInfo());
				   addlInfoTnx.setFixedAssetAdditionalInfo(adInfoTnx.getFixedAssetAdditionalInfo());
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 if(pcQRInfoTnx != null) {
				 
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			
				 return saveFixedAssetTnxData;
		 }
		 
	}
	
	@Transactional("transactionManager")
	public FixedAssetTnx passByReferencyForDisposeFixedAssetTnxBean(FixedAssetTnx passByReferencyTnx,FixedAssetTnx fixedAssetTnx) {
	     
		FixedAssetTnx tnx = new FixedAssetTnx();
		
	    tnx.setEntity(fixedAssetTnx.getEntity());
	    
	    if(passByReferencyTnx.getTnxStatusCode().equals(Common.TNX_STATUS_CODE[2])) {
	    	tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
	    }else {
	    	tnx.setFixedAssetTnxSeqId(passByReferencyTnx.getFixedAssetTnxSeqId());
	    }
		//tnx.setFixedAssetTnxSeqId(passByReferencyTnx.getFixedAssetTnxSeqId());
		tnx.setProdRefId(passByReferencyTnx.getProdRefId());
		tnx.setProductCode(fixedAssetTnx.getProductCode());
		tnx.setAssetType(fixedAssetTnx.getAssetType());
		tnx.setAssetSubType(fixedAssetTnx.getAssetSubType());
		tnx.setBusinessDate(new Date());
		tnx.setInvoiceDate(fixedAssetTnx.getInvoiceDate());
		tnx.setInvoiceRef(fixedAssetTnx.getInvoiceRef());
		tnx.setInvUnitPrice(fixedAssetTnx.getInvUnitPrice());
		tnx.setInvQuantity(fixedAssetTnx.getInvQuantity());
		tnx.setInvCurrency(fixedAssetTnx.getInvCurrency());
		tnx.setInvAmount(fixedAssetTnx.getInvAmount());
		tnx.setExchRate(fixedAssetTnx.getExchRate());
		tnx.setTnxCurrency(fixedAssetTnx.getTnxCurrency());
		tnx.setTnxAmount(fixedAssetTnx.getTnxAmount());
		tnx.setBookCurrency(fixedAssetTnx.getBookCurrency());
		tnx.setBookAmt(fixedAssetTnx.getBookAmt());
		tnx.setPurchaseDate(new Date());
		tnx.setAssetDesc1(fixedAssetTnx.getAssetDesc1());
		tnx.setAssetDesc2(fixedAssetTnx.getAssetDesc2());
		tnx.setAssetModel(fixedAssetTnx.getAssetModel());
		tnx.setSerialNo(fixedAssetTnx.getSerialNo());
		tnx.setUniqueId(fixedAssetTnx.getUniqueId());
		tnx.setAssetQuantity(fixedAssetTnx.getAssetQuantity());			
		tnx.setBranchCode(fixedAssetTnx.getBranchCode());
		tnx.setDeptCode(fixedAssetTnx.getDeptCode());
		tnx.setDepMethod(fixedAssetTnx.getDepMethod());
		tnx.setDepRate(fixedAssetTnx.getDepRate());
		tnx.setDepUsefulLife(fixedAssetTnx.getDepUsefulLife());
		tnx.setDepCollFrequency(fixedAssetTnx.getDepCollFrequency());
		tnx.setResidualCurrency(fixedAssetTnx.getResidualCurrency());
		tnx.setResidualValue(fixedAssetTnx.getResidualValue());
		tnx.setAccumDepCurrency(fixedAssetTnx.getAccumDepCurrency());
		tnx.setAccumDepAmt(fixedAssetTnx.getAccumDepAmt());	
		tnx.setDepSequence(0);
		tnx.setDisposeType(fixedAssetTnx.getDisposeType());
		tnx.setDisposalDate(new Date());
		tnx.setNetAssetCurrency(fixedAssetTnx.getNetAssetCurrency());
		tnx.setNetAssetAmount(fixedAssetTnx.getNetAssetAmount());
		tnx.setVendorCode(fixedAssetTnx.getVendorCode());
		tnx.setVendorName(fixedAssetTnx.getVendorName());
		tnx.setPurchaseDate(fixedAssetTnx.getPurchaseDate());
		tnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		tnx.setTnxStatusCode(Common.TNX_STATUS_CODE[1]);
		tnx.setTnxType(Common.TNX_TYPE[3]);
		tnx.setTnxSubType(fixedAssetTnx.getDisposeType());
		tnx.setBusinessDate(new Date());
		tnx.setInputDate(new Date());
		tnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		tnx.setFixedAsset(fixedAssetTnx.getFixedAsset()); 
		tnx.setTaskId(passByReferencyTnx.getTaskId());
		tnx.setTaskName(passByReferencyTnx.getTaskName());
		tnx.setArchiveFlag(passByReferencyTnx.getArchiveFlag());
		tnx.setAssetTracking(fixedAssetTnx.getAssetTracking());
		System.out.println("New Dispose Tnx%%%%%%%%%%%$$$$$$$$$$$$$$$$$"+passByReferencyTnx);
		System.out.println("New Dispose Tnx new Tnx%%%%%%%%%%%$$$$$$$$$$$$$$$$$"+ tnx);
		return fixedAssetTnxRepository.save(tnx);
	}

	@Override
	public FixedAssetTnx completeForDispose(FixedAssetTnx fixedAssetTnx) throws FamApplicationException {

		 FixedAssetAdditionalInfoTnx addlInfoTnx = fixedAssetTnx.getAddlInfoTnx();
		 PictureAndQRInfoTnx pcQRInfoTnx = fixedAssetTnx.getImgInfoTnx();
		 String fixedAssetTnxSeqId = fixedAssetTnx.getFixedAssetTnxSeqId();
		 String prodRefId = fixedAssetTnx.getProdRefId();
		 String fixedAssetMstSeqId = fixedAssetTnx.getFixedAsset().getFixedAssetMstSeqId();
		 
		 System.out.println("^^^^^^^^^^^^^^^^^^"+prodRefId);
		 System.out.println("%%%%%%%%%%%%%%%%%%"+fixedAssetMstSeqId);
		 List<FixedAssetTnx>  ftTnxLst = fixedAssetTnxRepository.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId);
		 FixedAssetTnx ftTnx = null;
	
		 if(ftTnxLst.size() != 0) {
			 ftTnx = ftTnxLst.get(0);
		 }
		 
		 fixedAssetTnx.setProdStatusCode(Common.PRODUCT_STATUS_CODE[1]);
		 fixedAssetTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[1]);
		 fixedAssetTnx.setTnxType(Common.TNX_TYPE[3]);
		 fixedAssetTnx.setTnxSubType(fixedAssetTnx.getDisposeType());
		 fixedAssetTnx.setBusinessDate(new Date());
		 fixedAssetTnx.setInputDate(new Date());
		 fixedAssetTnx.setInputUser(accountHelperImpl.getLoginUser().getUsername());
		 
		 String branchCode = fixedAssetTnx.getBranchCode();
		 String vendorCode = fixedAssetTnx.getVendorCode();
		 String depCode = fixedAssetTnx.getDeptCode();
		
		 CodeValue brnCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(branchCode);
		 CodeValue vendorCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(vendorCode);
		 CodeValue depCodeValue = codeValueRepository.findByCodeValueAndCodeValUpdateFlag(depCode);
		 
		 if(brnCodeValue == null) {
			 
			 throw new FamApplicationException(brnCodeValue + " Record Not Found in Mst.");
		 }
		 if(vendorCodeValue == null) {
			
			 throw new FamApplicationException(vendorCodeValue + " Record Not Found in Mst.");
		 }
		 if(depCodeValue == null) {
			
			 throw new FamApplicationException(depCodeValue + " Record Not Found in Mst.");
		 }
		
		 
		 if(ftTnx == null) {
				
			 fixedAssetTnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			 Task task = this.startUpdateTask(fixedAssetTnx);
			 fixedAssetTnx.setTaskId(task.getId());
			 fixedAssetTnx.setTaskName(task.getName());
			 FixedAssetTnx saveFixedAssetTnxData = fixedAssetTnxRepository.save(fixedAssetTnx);
			 FixedAssetAdditionalInfo addlInfoMst  = fixedAssetAdditionalInfoRepository.findByProdRefId(fixedAssetTnx.getProdRefId());
			 if(addlInfoTnx != null) {
			      
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				    System.out.println("Additional Info Tnx Information^^^^^^^^^^^^^^^^^^^^^^^^" + addlInfoTnx.toString());
				   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   addlInfoTnx.setFixedAssetAdditionalInfo(addlInfoMst);
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 
				 if(pcQRInfoTnx != null) {
				   
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			 return saveFixedAssetTnxData;
		
		 }else {
			 
			FixedAssetTnx saveFixedAssetTnxData = this.passByReferencyForDisposeFixedAssetTnxBean(ftTnx, fixedAssetTnx);
//			 if(addlInfoTnx != null) {
//			
//				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
//				   String addlInfoTnxSeqId = addlInfoTnx.getFixedAssetAddlTnxSeqId();
//				   FixedAssetAdditionalInfo addlInfoMst  = fixedAssetAdditionalInfoRepository.findByProdRefId(fixedAssetTnx.getProdRefId());
//				   
//				   if(addlInfoTnxSeqId == null) {
//					   
//					   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
//					      
//				   }
//				   
//				   
//				   
//				   addlInfoTnx.setBusinessDate(new Date());
//				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
//				   addlInfoTnx.setFixedAssetTnx(saveFixedAssetTnxData);
//				   addlInfoTnx.setFixedAssetAdditionalInfo(addlInfoMst);
//				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
//				   
//				 }
			 
			 if(addlInfoTnx != null) {
					
				   FixedAssetAdditionalInfoTnx adInfoTnx = fixedAssetTnx.getAddlInfoTnx();
				   List<FixedAssetAdditionalInfoTnx> addlTnxLst = fixedAssetAdditionalInfoTnxRepository.findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId
						   (prodRefId,adInfoTnx.getFixedAssetAdditionalInfo().getFixedAssetAddlMstSeqId(),
						   saveFixedAssetTnxData.getFixedAssetTnxSeqId());
				
				   FixedAssetAdditionalInfoTnx addlTnxInfoData = null;
				   if(addlTnxLst.size() > 0) {
					    addlTnxInfoData = addlTnxLst.get(0); 
				   }
				   
				   if(addlTnxInfoData == null) {
					   
					   addlInfoTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
					      
				   }
				 
				   addlInfoTnx.setBusinessDate(new Date());
				   addlInfoTnx.setFixedAssetTnx(fixedAssetTnx);
				   addlInfoTnx.setFixedAssetTnx(saveFixedAssetTnxData);
				   addlInfoTnx.setTaskId(saveFixedAssetTnxData.getTaskId());
				   addlInfoTnx.setFixedAssetAdditionalInfo(adInfoTnx.getFixedAssetAdditionalInfo());
				   fixedAssetAdditionalInfoTnxRepository.save(addlInfoTnx);
				   
				 }
				 if(pcQRInfoTnx != null) {
				 
					 PictureAndQRInfoTnx imgInfoTnx = fixedAssetTnx.getImgInfoTnx();
					 imgInfoTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
					 pictureAndQRInfoTnxRepository.save(imgInfoTnx);
				 }
			
				 return saveFixedAssetTnxData;
		 }
		 
	}
	
	public void generate(String prodRef) {
        // Create new configuration that specifies the error correction
        Map<EncodeHintType, ErrorCorrectionLevel> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = null;
        ByteArrayOutputStream os = new ByteArrayOutputStream();

        try {
            // init directory
        	String folderDir = path + "/" + prodRef + "/QR/"; 
            cleanDirectory(folderDir);
            initDirectory(folderDir);
            // Create a qr code with the url as content and a size of WxH px
            bitMatrix = writer.encode("Product Reference No.: " + prodRef, BarcodeFormat.QR_CODE, WIDTH, HEIGHT, hints);

            // Load QR image
            BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix, getMatrixConfig());

            // Load logo image
            Resource resource = new ClassPathResource("/images/logo.png");
            BufferedImage overly = getOverly(resource.getFile().getAbsolutePath());

            // Calculate the delta height and width between QR code and logo
            int deltaHeight = qrImage.getHeight() - overly.getHeight();
            int deltaWidth = qrImage.getWidth() - overly.getWidth();

            // Initialize combined image
            BufferedImage combined = new BufferedImage(qrImage.getHeight(), qrImage.getWidth(), BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = (Graphics2D) combined.getGraphics();

            // Write QR code to new image at position 0/0
            g.drawImage(qrImage, 0, 0, null);
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));

            // Write logo into combine image at position (deltaWidth / 2) and
            // (deltaHeight / 2). Background: Left/Right and Top/Bottom must be
            // the same space for the logo to be centered
            g.drawImage(overly, (int) Math.round(deltaWidth / 2), (int) Math.round(deltaHeight / 2), null);

            // Write combined image as PNG to OutputStream
            ImageIO.write(combined, "png", os);
            // Store Image
            Files.copy( new ByteArrayInputStream(os.toByteArray()), Paths.get(folderDir + prodRef +ext), StandardCopyOption.REPLACE_EXISTING);

        } catch (WriterException e) {
            e.printStackTrace();
            //LOG.error("WriterException occured", e);
        } catch (IOException e) {
            e.printStackTrace();
            //LOG.error("IOException occured", e);
        }
    }

    private static BufferedImage getOverly(String LOGO) throws IOException {
        File url = new File(LOGO);
        return ImageIO.read(url);
    }

    private static void initDirectory(String DIR) throws IOException {
        Files.createDirectories(Paths.get(DIR));
    }

    private static void cleanDirectory(String DIR) {
        try {
            Files.walk(Paths.get(DIR), FileVisitOption.FOLLOW_LINKS)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException e) {
            // Directory does not exist, Do nothing
        }
    }

    private static MatrixToImageConfig getMatrixConfig() {
        // ARGB Colors
        // Check Colors ENUM
        return new MatrixToImageConfig(QRCodeGenerator.Colors.BLACK.getArgb(), QRCodeGenerator.Colors.WHITE.getArgb());
    }

    private static String generateRandoTitle(Random random, int length) {
        return random.ints(48, 122)
                .filter(i -> (i < 57 || i > 65) && (i < 90 || i > 97))
                .mapToObj(i -> (char) i)
                .limit(length)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

    public enum Colors {

        BLUE(0xFF40BAD0),
        RED(0xFFE91C43),
        PURPLE(0xFF8A4F9E),
        ORANGE(0xFFF4B13D),
        WHITE(0xFFFFFFFF),
        BLACK(0xFF000000);

        private final int argb;

        Colors(final int argb){
            this.argb = argb;
        }

        public int getArgb(){
            return argb;
        }
    }

	
}