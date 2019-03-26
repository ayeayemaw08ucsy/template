package com.bbi.fam.service.impl;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.CodeValueRepository;
import com.bbi.fam.dao.FixedAssetAdditionalInfoRepository;
import com.bbi.fam.dao.FixedAssetAdditionalInfoTnxRepository;
import com.bbi.fam.dao.FixedAssetRepository;
import com.bbi.fam.dao.FixedAssetTnxRepository;
import com.bbi.fam.dao.PictureAndQRInfoRepository;
import com.bbi.fam.dao.PictureAndQRInfoTnxRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.dto.AssetDto;
import com.bbi.fam.dto.GraphDto;
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
import com.bbi.fam.model.Product;
import com.bbi.fam.model.User;
import com.bbi.fam.service.FixedAssetService;
import com.bbi.fam.service.ProductService;
import com.bbi.fam.utils.Common;
import com.bbi.fam.utils.CustomIdGeneration;
import com.bbi.fam.utils.ImageWriter;

@Service(value = "fixedAssetService")
public class FixedAssetServiceImpl implements FixedAssetService {
	
	@Value("${img.path}")
	public String base_path;	
	String pic_folder = "/Picture";
	String qr_folder = "/QR/";
	
	@Autowired
	private FixedAssetRepository fixedAssetRepository;
	
	@Autowired
	private FixedAssetTnxRepository fixedAssetTnxRepository;
	
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
	private ProductService productService;
	
	@Autowired
	private FixedAssetTnxServiceImpl tnxSrvImpl;
	
	@Autowired
	private AccountHelperImpl accountHelperImpl;
	
	public SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

	@Override
	@Transactional("transactionManager")
	public FixedAsset save(FixedAsset fixedAsset) {
		return fixedAssetRepository.save(fixedAsset);
	}

	@Override
	public List<FixedAsset> findAllByOrderByBusinessDate() {
		List<FixedAsset> list = new ArrayList<>();
		fixedAssetRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public FixedAsset findOne(String id) {
		return fixedAssetRepository.findByFixedAssetMstSeqId(id);
	}
	
	@Override
	public List<FixedAsset> getAllFixedAssets() {
		List<FixedAsset> list = new ArrayList<>();
		fixedAssetRepository.getAllFixedAssets().iterator().forEachRemaining(list::add);
		return list;
	}
	
	@Override
	@Transactional("transactionManager")
	public FixedAssetTnx saveAsDraft(FixedAssetTnx fixedAsset) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> entity = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		List<CodeValue> prod = codeValueRepository.findByCodeIdOrderByCodeValue("051");
		FixedAsset checkFixedAsset = fixedAssetRepository.findByProdRefId(fixedAsset.getProdRefId());		
		CustomIdGeneration idGen = new CustomIdGeneration();
		String prefix = "";
		Product product = new Product();
		Product prodRefId = null;
		
		if (fixedAsset.getProdRefId() == null || fixedAsset.getProdRefId().isEmpty()) {
			prefix = idGen.generateProductId(fixedAsset.getBranchCode(), new Date(), fixedAsset.getAssetType());
			product.setPrefix(prefix);
			prodRefId = productService.save(product);
			fixedAsset.setProdRefId(prodRefId.getId());
			System.out.println("prod ref " + prodRefId.getId());
		} 				
		System.out.println("check fixed asset " + checkFixedAsset);
		
		if (checkFixedAsset == null ) {
			
			if(entity != null && !entity.isEmpty()) {
				fixedAsset.setEntity(entity.get(0).getCodeValue());
			} else {
				
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			if (prod != null && !prod.isEmpty()) {
				fixedAsset.setProductCode(prod.get(0).getCodeValue());
			}
			
			FixedAssetTnx tnx = new FixedAssetTnx();
			if (fixedAsset.getFixedAssetTnxSeqId() == null || fixedAsset.getFixedAssetTnxSeqId().isEmpty()) {
				tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			} else {
				tnx.setFixedAssetTnxSeqId(fixedAsset.getFixedAssetTnxSeqId());
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
			tnx.setNetAssetCurrency(fixedAsset.getBookCurrency());
			tnx.setNetAssetAmount(fixedAsset.getNetAssetAmount());
			tnx.setVendorCode(fixedAsset.getVendorCode());
			tnx.setVendorName(fixedAsset.getVendorName());
			tnx.setProdStatusCode("01");
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("01");
			tnx.setInputDate(new Date());
			System.out.println("asset tracking " + fixedAsset.getAssetTracking());
			tnx.setAssetTracking(fixedAsset.getAssetTracking());
			fixedAssetTnxRepository.save(tnx);
			
			System.out.println("before checking null.");
			if (fixedAsset.getAddlInfoTnx() != null) {
				System.out.println("param not null.");
				
				FixedAssetAdditionalInfoTnx addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);
				
				if (addlTnx == null || addlTnx.equals(null)) {
					System.out.println("addlTnx null.");
					addlTnx = new FixedAssetAdditionalInfoTnx();
					addlTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
					System.out.println("addl gnid " + addlTnx.getFixedAssetAddlTnxSeqId());
				}
				addlTnx.setEntity(fixedAsset.getEntity());
				addlTnx.setProductCode(fixedAsset.getProductCode());
				addlTnx.setProdRefId(fixedAsset.getProdRefId());
				addlTnx.setBusinessDate(new Date());
				addlTnx.setNote1(fixedAsset.getAddlInfoTnx().getNote1());
				addlTnx.setNote2(fixedAsset.getAddlInfoTnx().getNote2());
				addlTnx.setNote3(fixedAsset.getAddlInfoTnx().getNote3());
				addlTnx.setNote4(fixedAsset.getAddlInfoTnx().getNote4());
				addlTnx.setInsuranceName(fixedAsset.getAddlInfoTnx().getInsuranceName());
				addlTnx.setInsuranceCode(fixedAsset.getAddlInfoTnx().getInsuranceCode());
				addlTnx.setInsuranceType(fixedAsset.getAddlInfoTnx().getInsuranceType());
				addlTnx.setInsuranceFrom(fixedAsset.getAddlInfoTnx().getInsuranceFrom());
				addlTnx.setInsuranceTo(fixedAsset.getAddlInfoTnx().getInsuranceTo());
				addlTnx.setWarrantyName(fixedAsset.getAddlInfoTnx().getWarrantyName());
				addlTnx.setWarrantyCode(fixedAsset.getAddlInfoTnx().getWarrantyCode());
				addlTnx.setWarrantyType(fixedAsset.getAddlInfoTnx().getWarrantyType());
				addlTnx.setWarrantyFrom(fixedAsset.getAddlInfoTnx().getWarrantyFrom());
				addlTnx.setWarrantyTo(fixedAsset.getAddlInfoTnx().getWarrantyTo());
				addlTnx.setSupportName(fixedAsset.getAddlInfoTnx().getSupportName());
				addlTnx.setSupportCode(fixedAsset.getAddlInfoTnx().getSupportCode());
				addlTnx.setSupportType(fixedAsset.getAddlInfoTnx().getSupportType());
				addlTnx.setSupportFrom(fixedAsset.getAddlInfoTnx().getSupportFrom());
				addlTnx.setSupportTo(fixedAsset.getAddlInfoTnx().getSupportTo());
				addlTnx.setTaxType(fixedAsset.getAddlInfoTnx().getTaxType());
				addlTnx.setTaxCode(fixedAsset.getAddlInfoTnx().getTaxCode());
				addlTnx.setTaxName(fixedAsset.getAddlInfoTnx().getTaxName());
				addlTnx.setTaxRate(fixedAsset.getAddlInfoTnx().getTaxRate());
				addlTnx.setTaxCurrency(fixedAsset.getAddlInfoTnx().getTaxCurrency());
				addlTnx.setTaxAmount(fixedAsset.getAddlInfoTnx().getTaxAmount());
				addlTnx.setFinanceType(fixedAsset.getAddlInfoTnx().getFinanceType());
				addlTnx.setFinanceCode(fixedAsset.getAddlInfoTnx().getFinanceCode());
				addlTnx.setFinanceName(fixedAsset.getAddlInfoTnx().getFinanceName());
				addlTnx.setFinanceCurrency(fixedAsset.getAddlInfoTnx().getFinanceCurrency());
				addlTnx.setFinanceAmt(fixedAsset.getAddlInfoTnx().getFinanceAmt());
				addlTnx.setRate(fixedAsset.getAddlInfoTnx().getRate());
				addlTnx.setFinanceFrom(fixedAsset.getAddlInfoTnx().getFinanceFrom());
				addlTnx.setFinanceTo(fixedAsset.getAddlInfoTnx().getFinanceTo());	
				addlTnx.setFixedAssetTnx(tnx);
				
				fixedAssetAdditionalInfoTnxRepository.save(addlTnx);
			}
			
			String imgSrc = "";
			if (fixedAsset.getImgInfoTnx() != null) {
				
				imgSrc = fixedAsset.getImgInfoTnx().getImageSrc();
				int imgIndex = imgSrc.indexOf("base64,");
				System.out.println("imgIndex " + imgIndex);
				System.out.println("base path " + base_path);
				System.out.println("img src " + imgSrc.substring(imgIndex + 7, imgSrc.length()));
				String path = base_path + fixedAsset.getProdRefId() + pic_folder;
				String pic_name = path + "/fixed-asset-1.jpeg"; 
				
				PictureAndQRInfoTnx imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
				if (imgTnx == null || imgTnx.equals(null)) {
					imgTnx = new PictureAndQRInfoTnx();
					imgTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
				}
				imgTnx.setEntity(fixedAsset.getEntity());
				imgTnx.setProductCode(fixedAsset.getProductCode());
				imgTnx.setProdRefId(fixedAsset.getProdRefId());
				imgTnx.setBusinessDate(new Date());
				imgTnx.setTrackingCode(fixedAsset.getImgInfoTnx().getTrackingCode());
				imgTnx.setTrackingFileName(fixedAsset.getImgInfoTnx().getTrackingFileName());
				imgTnx.setTrackingFileLocation(fixedAsset.getImgInfoTnx().getTrackingFileLocation());
				imgTnx.setTrackingCreateDate(new Date());
				imgTnx.setVerifiedCode(fixedAsset.getImgInfoTnx().getVerifiedCode());
				imgTnx.setVerifiedFileName(fixedAsset.getImgInfoTnx().getVerifiedFileName());
				imgTnx.setVerifiedFileLocation(fixedAsset.getImgInfoTnx().getVerifiedFileLocation());
				imgTnx.setVerifiedDate(new Date());
				imgTnx.setPictureCode(fixedAsset.getImgInfoTnx().getPictureCode());
				imgTnx.setPictureFileName(pic_name);
				imgTnx.setPictureFileLocation(path);
				imgTnx.setPictureCaptureDate(new Date());
				imgTnx.setFixedAssetTnx(tnx);
				
				pictureAndQRInfoTnxRepository.save(imgTnx);
				
				ImageWriter imgWriter = new ImageWriter();
				imgWriter.writeRequestAndResponse(fixedAsset.getProdRefId(), imgSrc.substring(imgIndex + 7, imgSrc.length()), path, pic_name);
				
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
	public FixedAsset register(FixedAsset fixedAsset) throws FamApplicationException {
		return null;
	}

	@Override
	public FixedAsset delete(String id) throws FamApplicationException, Exception {
		return null;
	}

	@Override
	public FixedAsset update(FixedAsset fixedAsset) throws FamApplicationException {
		return null;
	}

	@Override
	@Transactional("transactionManager")
	public FixedAsset approve(FixedAsset fixedAssetTnx) throws FamApplicationException, SQLException, ParseException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		Calendar cal = Calendar.getInstance();
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		FixedAsset checkFixedAsset = fixedAssetRepository.findByProdRefId(fixedAssetTnx.getProdRefId());		
		CustomIdGeneration idGen = new CustomIdGeneration();
		System.out.println("check fixed asset " + checkFixedAsset);
		FixedAsset fixedAsset = new FixedAsset();
		FixedAssetTnx tnx = fixedAssetTnxRepository.findByFixedAssetTnxSeqId(fixedAssetTnx.getFixedAssetTnxSeqId());
		
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
			
			fixedAsset.setFixedAssetMstSeqId(idGen.generateTxnId(new Date()));
			fixedAsset.setEntity(tnx.getEntity());
			fixedAsset.setProductCode(tnx.getProductCode());
			fixedAsset.setAssetType(tnx.getAssetType());
			fixedAsset.setAssetSubType(tnx.getAssetSubType());
			fixedAsset.setProdRefId(tnx.getProdRefId());
			fixedAsset.setBusinessDate(new Date());
			fixedAsset.setInvoiceDate(formatter.parse(formatter.format(tnx.getInvoiceDate())));
			fixedAsset.setInvoiceRef(tnx.getInvoiceRef());
			fixedAsset.setInvUnitPrice(tnx.getInvUnitPrice());
			fixedAsset.setInvQuantity(tnx.getInvQuantity());
			fixedAsset.setInvCurrency(tnx.getInvCurrency());
			fixedAsset.setInvAmount(tnx.getInvAmount());
			fixedAsset.setExchRate(tnx.getExchRate());
			fixedAsset.setTnxCurrency(tnx.getTnxCurrency());
			fixedAsset.setTnxAmount(tnx.getTnxAmount());
			fixedAsset.setBookCurrency(tnx.getBookCurrency());
			fixedAsset.setBookAmt(tnx.getBookAmt());
			fixedAsset.setPurchaseDate(formatter.parse(formatter.format(tnx.getPurchaseDate())));
			fixedAsset.setAssetDesc1(tnx.getAssetDesc1());
			fixedAsset.setAssetDesc2(tnx.getAssetDesc2());
			fixedAsset.setAssetModel(tnx.getAssetModel());
			fixedAsset.setSerialNo(tnx.getSerialNo());
			fixedAsset.setUniqueId(tnx.getUniqueId());
			fixedAsset.setAssetQuantity(tnx.getAssetQuantity());			
			fixedAsset.setBranchCode(tnx.getBranchCode());
			fixedAsset.setDeptCode(tnx.getDeptCode());
			fixedAsset.setDepMethod(tnx.getDepMethod());
			fixedAsset.setDepRate(tnx.getDepRate());
			fixedAsset.setDepUsefulLife(tnx.getDepUsefulLife());
			fixedAsset.setDepCollFrequency(tnx.getDepCollFrequency());
			fixedAsset.setResidualCurrency(tnx.getResidualCurrency());
			fixedAsset.setResidualValue(tnx.getResidualValue());
			fixedAsset.setAccumDepCurrency(tnx.getAccumDepCurrency());
			fixedAsset.setAccumDepAmt(tnx.getAccumDepAmt());	
			fixedAsset.setDepSequence(0);
			fixedAsset.setNetAssetCurrency(tnx.getBookCurrency());
			fixedAsset.setNetAssetAmount(tnx.getNetAssetAmount());
			fixedAsset.setVendorCode(tnx.getVendorCode());
			fixedAsset.setVendorName(tnx.getVendorName());
			fixedAsset.setProdStatusCode("01");
			fixedAsset.setTnxType(tnx.getTnxType());
			fixedAsset.setRegister(false);
			fixedAsset.setNeedDepreciate(true);			
			Date purchaseDate = fixedAsset.getPurchaseDate();
			if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("M")) {
				
				cal.setTime(purchaseDate);
				cal.add(Calendar.MONTH, 1);
				Date nextCollectionDate = cal.getTime();
				System.out.println("nextCollectionDate " + nextCollectionDate);
				fixedAsset.setNextCollectionDate(nextCollectionDate);
			} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("Q")) {
				
				cal.setTime(purchaseDate);
				cal.add(Calendar.MONTH, 3);
				Date nextCollectionDate = cal.getTime();
				System.out.println("nextCollectionDate " + nextCollectionDate);
				fixedAsset.setNextCollectionDate(nextCollectionDate);
			} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("H")) {
				
				cal.setTime(purchaseDate);
				cal.add(Calendar.MONTH, 6);
				Date nextCollectionDate = cal.getTime();
				System.out.println("nextCollectionDate " + nextCollectionDate);
				fixedAsset.setNextCollectionDate(nextCollectionDate);
			} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("Y")) {
				
				cal.setTime(purchaseDate);
				cal.add(Calendar.MONTH, 6);
				Date nextCollectionDate = cal.getTime();
				System.out.println("nextCollectionDate " + nextCollectionDate);
				fixedAsset.setNextCollectionDate(nextCollectionDate);
			}
				
			tnx.setFixedAsset(fixedAsset);
			tnx.setBusinessDate(new Date());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("03");
			tnx.setApproveUser(loginUser.getUsername());
			tnx.setApproveDate(new Date());
			
			FixedAssetAdditionalInfoTnx addlTnx = null;
			FixedAssetAdditionalInfo addl = new FixedAssetAdditionalInfo();
			
			addl.setFixedAssetAddlMstSeqId(idGen.generateTxnId(new Date()));
			addl.setEntity(fixedAssetTnx.getEntity());
			addl.setProductCode(fixedAssetTnx.getProductCode());
			addl.setProdRefId(fixedAssetTnx.getProdRefId());
			addl.setBusinessDate(new Date());
			addl.setNote1(fixedAssetTnx.getAddlInfo().getNote1());
			addl.setNote2(fixedAssetTnx.getAddlInfo().getNote2());
			addl.setNote3(fixedAssetTnx.getAddlInfo().getNote3());
			addl.setNote4(fixedAssetTnx.getAddlInfo().getNote4());
			addl.setInsuranceName(fixedAssetTnx.getAddlInfo().getInsuranceName());
			addl.setInsuranceCode(fixedAssetTnx.getAddlInfo().getInsuranceCode());
			addl.setInsuranceType(fixedAssetTnx.getAddlInfo().getInsuranceType());
			addl.setInsuranceFrom(fixedAssetTnx.getAddlInfo().getInsuranceFrom());
			addl.setInsuranceTo(fixedAssetTnx.getAddlInfo().getInsuranceTo());
			addl.setWarrantyName(fixedAssetTnx.getAddlInfo().getWarrantyName());
			addl.setWarrantyCode(fixedAssetTnx.getAddlInfo().getWarrantyCode());
			addl.setWarrantyType(fixedAssetTnx.getAddlInfo().getWarrantyType());
			addl.setWarrantyFrom(fixedAssetTnx.getAddlInfo().getWarrantyFrom());
			addl.setWarrantyTo(fixedAssetTnx.getAddlInfo().getWarrantyTo());
			addl.setSupportName(fixedAssetTnx.getAddlInfo().getSupportName());
			addl.setSupportCode(fixedAssetTnx.getAddlInfo().getSupportCode());
			addl.setSupportType(fixedAssetTnx.getAddlInfo().getSupportType());
			addl.setSupportFrom(fixedAssetTnx.getAddlInfo().getSupportFrom());
			addl.setSupportTo(fixedAssetTnx.getAddlInfo().getSupportTo());
			addl.setTaxType(fixedAssetTnx.getAddlInfo().getTaxType());
			addl.setTaxCode(fixedAssetTnx.getAddlInfo().getTaxCode());
			addl.setTaxName(fixedAssetTnx.getAddlInfo().getTaxName());
			addl.setTaxRate(fixedAssetTnx.getAddlInfo().getTaxRate());
			addl.setTaxCurrency(fixedAssetTnx.getAddlInfo().getTaxCurrency());
			addl.setTaxAmount(fixedAssetTnx.getAddlInfo().getTaxAmount());
			addl.setFinanceType(fixedAssetTnx.getAddlInfo().getFinanceType());
			addl.setFinanceCode(fixedAssetTnx.getAddlInfo().getFinanceCode());
			addl.setFinanceName(fixedAssetTnx.getAddlInfo().getFinanceName());
			addl.setFinanceCurrency(fixedAssetTnx.getAddlInfo().getFinanceCurrency());
			addl.setFinanceAmt(fixedAssetTnx.getAddlInfo().getFinanceAmt());
			addl.setRate(fixedAssetTnx.getAddlInfo().getRate());
			addl.setFinanceFrom(fixedAssetTnx.getAddlInfo().getFinanceFrom());
			addl.setFinanceTo(fixedAssetTnx.getAddlInfo().getFinanceTo());		
			
			addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);
			if (addlTnx == null) {
				addlTnx = new FixedAssetAdditionalInfoTnx();					
				addlTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
				
			} 
			addlTnx.setEntity(fixedAssetTnx.getEntity());
			addlTnx.setProductCode(fixedAssetTnx.getProductCode());
			addlTnx.setProdRefId(fixedAssetTnx.getProdRefId());
			addlTnx.setBusinessDate(new Date());
			addlTnx.setNote1(fixedAssetTnx.getAddlInfo().getNote1());
			addlTnx.setNote2(fixedAssetTnx.getAddlInfo().getNote2());
			addlTnx.setNote3(fixedAssetTnx.getAddlInfo().getNote3());
			addlTnx.setNote4(fixedAssetTnx.getAddlInfo().getNote4());
			addlTnx.setInsuranceName(fixedAssetTnx.getAddlInfo().getInsuranceName());
			addlTnx.setInsuranceCode(fixedAssetTnx.getAddlInfo().getInsuranceCode());
			addlTnx.setInsuranceType(fixedAssetTnx.getAddlInfo().getInsuranceType());
			addlTnx.setInsuranceFrom(fixedAssetTnx.getAddlInfo().getInsuranceFrom());
			addlTnx.setInsuranceTo(fixedAssetTnx.getAddlInfo().getInsuranceTo());
			addlTnx.setWarrantyName(fixedAssetTnx.getAddlInfo().getWarrantyName());
			addlTnx.setWarrantyCode(fixedAssetTnx.getAddlInfo().getWarrantyCode());
			addlTnx.setWarrantyType(fixedAssetTnx.getAddlInfo().getWarrantyType());
			addlTnx.setWarrantyFrom(fixedAssetTnx.getAddlInfo().getWarrantyFrom());
			addlTnx.setWarrantyTo(fixedAssetTnx.getAddlInfo().getWarrantyTo());
			addlTnx.setSupportName(fixedAssetTnx.getAddlInfo().getSupportName());
			addlTnx.setSupportCode(fixedAssetTnx.getAddlInfo().getSupportCode());
			addlTnx.setSupportType(fixedAssetTnx.getAddlInfo().getSupportType());
			addlTnx.setSupportFrom(fixedAssetTnx.getAddlInfo().getSupportFrom());
			addlTnx.setSupportTo(fixedAssetTnx.getAddlInfo().getSupportTo());
			addlTnx.setTaxType(fixedAssetTnx.getAddlInfo().getTaxType());
			addlTnx.setTaxCode(fixedAssetTnx.getAddlInfo().getTaxCode());
			addlTnx.setTaxName(fixedAssetTnx.getAddlInfo().getTaxName());
			addlTnx.setTaxRate(fixedAssetTnx.getAddlInfo().getTaxRate());
			addlTnx.setTaxCurrency(fixedAssetTnx.getAddlInfo().getTaxCurrency());
			addlTnx.setTaxAmount(fixedAssetTnx.getAddlInfo().getTaxAmount());
			addlTnx.setFinanceType(fixedAssetTnx.getAddlInfo().getFinanceType());
			addlTnx.setFinanceCode(fixedAssetTnx.getAddlInfo().getFinanceCode());
			addlTnx.setFinanceName(fixedAssetTnx.getAddlInfo().getFinanceName());
			addlTnx.setFinanceCurrency(fixedAssetTnx.getAddlInfo().getFinanceCurrency());
			addlTnx.setFinanceAmt(fixedAssetTnx.getAddlInfo().getFinanceAmt());
			addlTnx.setRate(fixedAssetTnx.getAddlInfo().getRate());
			addlTnx.setFinanceFrom(fixedAssetTnx.getAddlInfo().getFinanceFrom());
			addlTnx.setFinanceTo(fixedAssetTnx.getAddlInfo().getFinanceTo());
			addlTnx.setFixedAssetAdditionalInfo(addl);
			addlTnx.setFixedAssetTnx(tnx);
			
			PictureAndQRInfoTnx imgTnx = null;
			PictureAndQRInfo img = new PictureAndQRInfo();	
			String path = base_path + fixedAsset.getProdRefId() + qr_folder;
			String qr_name = base_path + fixedAsset.getProdRefId() + qr_folder + fixedAsset.getProdRefId() + ".png";
			
			img.setPictureAndQrSeqId(idGen.generateTxnId(new Date()));
			img.setEntity(fixedAssetTnx.getEntity());
			img.setProductCode(fixedAssetTnx.getProductCode());
			img.setProdRefId(fixedAssetTnx.getProdRefId());
			img.setBusinessDate(new Date());
			if (tnx.getAssetTracking() != null && tnx.getAssetTracking().equalsIgnoreCase("Y")) {
				img.setTrackingCode(fixedAssetTnx.getProdRefId());
				img.setTrackingFileName(qr_name);
				img.setTrackingFileLocation(path);
				img.setTrackingCreateDate(new Date());
			}			
			img.setVerifiedCode(fixedAssetTnx.getImgInfo().getVerifiedCode());
			img.setVerifiedFileName(fixedAssetTnx.getImgInfo().getVerifiedFileName());
			img.setVerifiedFileLocation(fixedAssetTnx.getImgInfo().getVerifiedFileLocation());
			img.setVerifiedDate(new Date());
			img.setPictureCode(fixedAssetTnx.getImgInfo().getPictureCode());
			img.setPictureFileName(fixedAssetTnx.getImgInfo().getPictureFileName());
			img.setPictureFileLocation(fixedAssetTnx.getImgInfo().getPictureFileLocation());
			img.setPictureCaptureDate(new Date());
			
			
			imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
			if (imgTnx == null) {
				
				imgTnx = new PictureAndQRInfoTnx();
				imgTnx.setPictureAndQrTnxSeqId(idGen.generateTxnId(new Date()));
			} 
			imgTnx.setEntity(fixedAssetTnx.getEntity());
			imgTnx.setProductCode(fixedAssetTnx.getProductCode());
			imgTnx.setProdRefId(fixedAssetTnx.getProdRefId());
			imgTnx.setBusinessDate(new Date());
			if (tnx.getAssetTracking() != null && tnx.getAssetTracking().equalsIgnoreCase("Y")) {
				imgTnx.setTrackingCode(fixedAssetTnx.getProdRefId());
				imgTnx.setTrackingFileName(qr_name);
				imgTnx.setTrackingFileLocation(path);
				imgTnx.setTrackingCreateDate(new Date());
			}			
			imgTnx.setVerifiedCode(fixedAssetTnx.getImgInfo().getVerifiedCode());
			imgTnx.setVerifiedFileName(fixedAssetTnx.getImgInfo().getVerifiedFileName());
			imgTnx.setVerifiedFileLocation(fixedAssetTnx.getImgInfo().getVerifiedFileLocation());
			imgTnx.setVerifiedDate(fixedAssetTnx.getImgInfo().getVerifiedDate());
			imgTnx.setPictureCode(fixedAssetTnx.getImgInfo().getPictureCode());
			imgTnx.setPictureFileName(fixedAssetTnx.getImgInfo().getPictureFileName());
			imgTnx.setPictureFileLocation(fixedAssetTnx.getImgInfo().getPictureFileLocation());
			imgTnx.setPictureCaptureDate(fixedAssetTnx.getImgInfo().getPictureCaptureDate());
			imgTnx.setPictureAndQRInfo(img);
			imgTnx.setFixedAssetTnx(tnx);
			
			fixedAssetRepository.save(fixedAsset);
			fixedAssetTnxRepository.save(tnx);
			fixedAssetAdditionalInfoRepository.save(addl);
			fixedAssetAdditionalInfoTnxRepository.save(addlTnx);
			pictureAndQRInfoRepository.save(img);
			pictureAndQRInfoTnxRepository.save(imgTnx);
			
			if (tnx.getAssetTracking() != null && tnx.getAssetTracking().equalsIgnoreCase("Y")) {
				tnxSrvImpl.generate(fixedAssetTnx.getProdRefId());
			}
		}
		
		return fixedAsset;
	}

	@Override
	public FixedAsset requestForUpdate(String fixedAssetTnxSeqId) throws FamApplicationException, SQLException {
		
		FixedAsset fx = new FixedAsset();
		PictureAndQRInfo img = new PictureAndQRInfo();	
		FixedAssetAdditionalInfo addl = new FixedAssetAdditionalInfo();
		FixedAssetTnx tnx = fixedAssetTnxRepository.findByFixedAssetTnxSeqId(fixedAssetTnxSeqId);
		if (tnx != null) {
			FixedAssetAdditionalInfoTnx addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);
			if (addlTnx != null) {
				addl.setFixedAssetAddlTnxSeqId(addlTnx.getFixedAssetAddlTnxSeqId());
				addl.setEntity(addlTnx.getEntity());
				addl.setProductCode(addlTnx.getProductCode());
				addl.setProdRefId(addlTnx.getProdRefId());
				addl.setBusinessDate(addlTnx.getBusinessDate());
				addl.setNote1(addlTnx.getNote1());
				addl.setNote2(addlTnx.getNote2());
				addl.setNote3(addlTnx.getNote3());
				addl.setNote4(addlTnx.getNote4());
				addl.setInsuranceName(addlTnx.getInsuranceName());
				addl.setInsuranceCode(addlTnx.getInsuranceCode());
				addl.setInsuranceType(addlTnx.getInsuranceType());
				addl.setInsuranceFrom(addlTnx.getInsuranceFrom());
				addl.setInsuranceTo(addlTnx.getInsuranceTo());
				addl.setWarrantyName(addlTnx.getWarrantyName());
				addl.setWarrantyCode(addlTnx.getWarrantyCode());
				addl.setWarrantyType(addlTnx.getWarrantyType());
				addl.setWarrantyFrom(addlTnx.getWarrantyFrom());
				addl.setWarrantyTo(addlTnx.getWarrantyTo());
				addl.setSupportName(addlTnx.getSupportName());
				addl.setSupportCode(addlTnx.getSupportCode());
				addl.setSupportType(addlTnx.getSupportType());
				addl.setSupportFrom(addlTnx.getSupportFrom());
				addl.setSupportTo(addlTnx.getSupportTo());
				addl.setTaxType(addlTnx.getTaxType());
				addl.setTaxCode(addlTnx.getTaxCode());
				addl.setTaxName(addlTnx.getTaxName());
				addl.setTaxRate(addlTnx.getTaxRate());
				addl.setTaxCurrency(addlTnx.getTaxCurrency());
				addl.setTaxAmount(addlTnx.getTaxAmount());
				addl.setFinanceType(addlTnx.getFinanceType());
				addl.setFinanceCode(addlTnx.getFinanceCode());
				addl.setFinanceName(addlTnx.getFinanceName());
				addl.setFinanceCurrency(addlTnx.getFinanceCurrency());
				addl.setFinanceAmt(addlTnx.getFinanceAmt());
				addl.setRate(addlTnx.getRate());
				addl.setFinanceFrom(addlTnx.getFinanceFrom());
				addl.setFinanceTo(addlTnx.getFinanceTo());
			}
			
			PictureAndQRInfoTnx imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
			if (imgTnx != null) {
				img.setPictureAndQrTnxSeqId(imgTnx.getPictureAndQrTnxSeqId());
				img.setEntity(imgTnx.getEntity());
				img.setProductCode(imgTnx.getProductCode());
				img.setProdRefId(imgTnx.getProdRefId());
				img.setBusinessDate(imgTnx.getBusinessDate());
				img.setTrackingCode(imgTnx.getTrackingCode());
				img.setTrackingFileName(imgTnx.getTrackingFileName());
				img.setTrackingFileLocation(imgTnx.getTrackingFileLocation());
				img.setTrackingCreateDate(imgTnx.getTrackingCreateDate());
				img.setVerifiedCode(imgTnx.getVerifiedCode());
				img.setVerifiedFileName(imgTnx.getVerifiedFileName());
				img.setVerifiedFileLocation(imgTnx.getVerifiedFileLocation());
				img.setVerifiedDate(imgTnx.getVerifiedDate());
				img.setPictureCode(imgTnx.getPictureCode());
				img.setPictureFileName(imgTnx.getPictureFileName());
				img.setPictureFileLocation(imgTnx.getPictureFileLocation());
				img.setPictureCaptureDate(imgTnx.getPictureCaptureDate());
			}
		
			fx.setEntity(tnx.getEntity());
			fx.setProductCode(tnx.getProductCode());
			fx.setAssetType(tnx.getAssetType());
			fx.setAssetSubType(tnx.getAssetSubType());
			fx.setProdRefId(tnx.getProdRefId());
			fx.setBusinessDate(tnx.getBusinessDate());
			fx.setInvoiceDate(tnx.getInvoiceDate());
			fx.setInvoiceRef(tnx.getInvoiceRef());
			fx.setInvUnitPrice(tnx.getInvUnitPrice());
			fx.setInvQuantity(tnx.getInvQuantity());
			fx.setInvCurrency(tnx.getInvCurrency());
			fx.setInvAmount(tnx.getInvAmount());
			fx.setExchRate(tnx.getExchRate());
			fx.setTnxCurrency(tnx.getTnxCurrency());
			fx.setTnxAmount(tnx.getTnxAmount());
			fx.setBookCurrency(tnx.getBookCurrency());
			fx.setBookAmt(tnx.getBookAmt());
			fx.setPurchaseDate(tnx.getPurchaseDate());
			fx.setAssetDesc1(tnx.getAssetDesc1());
			fx.setAssetDesc2(tnx.getAssetDesc2());
			fx.setAssetModel(tnx.getAssetModel());
			fx.setSerialNo(tnx.getSerialNo());
			fx.setUniqueId(tnx.getUniqueId());
			fx.setAssetQuantity(tnx.getAssetQuantity());			
			fx.setBranchCode(tnx.getBranchCode());
			fx.setDeptCode(tnx.getDeptCode());
			fx.setDepMethod(tnx.getDepMethod());
			fx.setDepRate(tnx.getDepRate());
			fx.setDepUsefulLife(tnx.getDepUsefulLife());
			fx.setDepCollFrequency(tnx.getDepCollFrequency());
			fx.setResidualCurrency(tnx.getResidualCurrency());
			fx.setResidualValue(tnx.getResidualValue());
			fx.setAccumDepCurrency(tnx.getAccumDepCurrency());
			fx.setAccumDepAmt(tnx.getAccumDepAmt());	
			fx.setDepSequence(tnx.getDepSequence());
			fx.setNetAssetCurrency(tnx.getBookCurrency());
			fx.setNetAssetAmount(tnx.getNetAssetAmount());
			fx.setVendorCode(tnx.getVendorCode());
			fx.setVendorName(tnx.getVendorName());
			fx.setProdStatusCode(tnx.getProdStatusCode());
			fx.setFixedAssetTnxSeqId(tnx.getFixedAssetTnxSeqId());
			if (tnx.getTnxStatusCode().equalsIgnoreCase("01")) {
				fx.setRegister(false);
				fx.setDraft(true);
			} else if (tnx.getTnxStatusCode().equalsIgnoreCase("02")) {
				fx.setRegister(true);
				fx.setDraft(false);
			}
			fx.setAddlInfo(addl);
			fx.setImgInfo(img);		
		}
		return fx;
	}

	@Override
	public FixedAsset updateApprove(FixedAssetTnx fixedAssetTnx) throws FamApplicationException, SQLException {
		return null;
	}

	@Override
	public FixedAsset approveForUpdate(FixedAssetTnx fxTnx) throws FamApplicationException {
		   
				FixedAsset fxMst = fxTnx.getFixedAsset();
				FixedAsset  saveDataFxMst = this.swapFixedAssetMstBean(fxTnx, fxMst);
				fxTnx.setFixedAsset(saveDataFxMst);
				fxTnx.setApproveDate(new Date());
				fxTnx.setApproveUser(accountHelperImpl.getLoginUser().getUsername());
				fixedAssetTnxRepository.save(fxTnx);
				
				FixedAssetAdditionalInfoTnx addlInfoTnx  = fxTnx.getAddlInfoTnx();
				String prodRefId = addlInfoTnx.getProdRefId();
				FixedAssetAdditionalInfo addlInfoMst = fixedAssetAdditionalInfoRepository.findByProdRefId(prodRefId);
				FixedAssetAdditionalInfo saveAddlInfoMst = this.swapFixedAssetAddlInfoBean(addlInfoTnx,addlInfoMst);
		
				PictureAndQRInfoTnx pcQRInfoTnx = fxTnx.getImgInfoTnx();
				if(pcQRInfoTnx != null ) {
				
					PictureAndQRInfo pcQRInfoMst = pictureAndQRInfoRepository.findByProdRefId(pcQRInfoTnx.getProdRefId());
					
				}
				
				return saveDataFxMst;
	}
 
	@Transactional("transactionManager")
	public PictureAndQRInfo  swapPictureAndQRInfoMstBean(PictureAndQRInfoTnx pcInfoTnx , PictureAndQRInfo pcInfoMst) {
		pcInfoMst.setEntity(pcInfoTnx.getEntity());
		pcInfoMst.setProductCode(pcInfoTnx.getProductCode());
		pcInfoMst.setProdRefId(pcInfoTnx.getProdRefId());
		pcInfoMst.setBusinessDate(new Date());
		pcInfoMst.setTrackingCode(pcInfoTnx.getTrackingCode());
		pcInfoMst.setTrackingFileName(pcInfoTnx.getTrackingFileName());
		pcInfoMst.setTrackingFileLocation(pcInfoTnx.getTrackingFileLocation());
		pcInfoMst.setTrackingCreateDate(new Date());
		pcInfoMst.setVerifiedCode(pcInfoTnx.getVerifiedCode());
		pcInfoMst.setVerifiedFileName(pcInfoTnx.getVerifiedFileName());
		pcInfoMst.setVerifiedFileLocation(pcInfoTnx.getVerifiedFileLocation());
		pcInfoMst.setVerifiedDate(new Date());
		pcInfoMst.setPictureCode(pcInfoTnx.getPictureCode());
		pcInfoMst.setPictureFileName(pcInfoTnx.getPictureFileName());
		pcInfoMst.setPictureFileLocation(pcInfoTnx.getPictureFileLocation());
		pcInfoMst.setPictureCaptureDate(new Date());
		
		return pictureAndQRInfoRepository.save(pcInfoMst);
	}

	@Transactional("transactionManager")
	public FixedAssetAdditionalInfo swapFixedAssetAddlInfoBean(FixedAssetAdditionalInfoTnx addlTnx, FixedAssetAdditionalInfo addlInfoMst) {
		addlInfoMst.setEntity(addlTnx.getEntity());
		addlInfoMst.setProductCode(addlTnx.getProductCode());
		addlInfoMst.setProdRefId(addlTnx.getProdRefId());
		addlInfoMst.setBusinessDate(new Date());
		addlInfoMst.setNote1(addlTnx.getNote1());
		addlInfoMst.setNote2(addlTnx.getNote2());
		addlInfoMst.setNote3(addlTnx.getNote3());
		addlInfoMst.setNote4(addlTnx.getNote4());
		addlInfoMst.setInsuranceName(addlTnx.getInsuranceName());
		addlInfoMst.setInsuranceCode(addlTnx.getInsuranceCode());
		addlInfoMst.setInsuranceType(addlTnx.getInsuranceType());
		addlInfoMst.setInsuranceFrom(addlTnx.getInsuranceFrom());
		addlInfoMst.setInsuranceTo(addlTnx.getInsuranceTo());
		addlInfoMst.setInsuranceCode(addlTnx.getInsuranceCode());
		addlInfoMst.setWarrantyName(addlTnx.getWarrantyName());
		addlInfoMst.setWarrantyCode(addlTnx.getWarrantyCode());
		addlInfoMst.setWarrantyType(addlTnx.getWarrantyType());
		addlInfoMst.setWarrantyFrom(addlTnx.getWarrantyFrom());
		addlInfoMst.setWarrantyTo(addlTnx.getWarrantyTo());
		addlInfoMst.setSupportName(addlTnx.getSupportName());
		addlInfoMst.setSupportCode(addlTnx.getSupportCode());
		addlInfoMst.setSupportType(addlTnx.getSupportType());
		addlInfoMst.setSupportFrom(addlTnx.getSupportFrom());
		addlInfoMst.setSupportTo(addlTnx.getSupportTo());
		addlInfoMst.setTaxType(addlTnx.getTaxType());
		addlInfoMst.setTaxCode(addlTnx.getTaxCode());
		addlInfoMst.setTaxName(addlTnx.getTaxName());
		addlInfoMst.setTaxRate(addlTnx.getTaxRate());
		addlInfoMst.setTaxCurrency(addlTnx.getTaxCurrency());
		addlInfoMst.setTaxAmount(addlTnx.getTaxAmount());
		addlInfoMst.setFinanceType(addlTnx.getFinanceType());
		addlInfoMst.setFinanceCode(addlTnx.getFinanceCode());
		addlInfoMst.setFinanceName(addlTnx.getFinanceName());
		addlInfoMst.setFinanceCurrency(addlTnx.getFinanceCurrency());
		addlInfoMst.setFinanceAmt(addlTnx.getFinanceAmt());
		addlInfoMst.setFinanceCode(addlTnx.getFinanceCode());		
		addlInfoMst.setRate(addlTnx.getRate());
		addlInfoMst.setFinanceFrom(addlTnx.getFinanceFrom());
		addlInfoMst.setFinanceTo(addlTnx.getFinanceTo());
			
	   return fixedAssetAdditionalInfoRepository.save(addlInfoMst);
	}
	
	@Transactional("transactionManager")
	public FixedAsset swapFixedAssetMstBean(FixedAssetTnx fixedAssetTnx, FixedAsset fxMst) {
		fxMst.setEntity(fixedAssetTnx.getEntity());
		//fxMst.setProductCode(fixedAssetTnx.getProductCode());
		fxMst.setAssetType(fixedAssetTnx.getAssetType());
		fxMst.setAssetSubType(fixedAssetTnx.getAssetSubType());
		//fxMst.setProdRefId(fixedAssetTnx.getProdRefId());
		fxMst.setBusinessDate(new Date());
		fxMst.setInvoiceDate(new Date());
		fxMst.setInvoiceRef(fixedAssetTnx.getInvoiceRef());
		fxMst.setInvUnitPrice(fixedAssetTnx.getInvUnitPrice());
		fxMst.setInvQuantity(fixedAssetTnx.getInvQuantity());
		fxMst.setInvCurrency(fixedAssetTnx.getInvCurrency());
		fxMst.setInvAmount(fixedAssetTnx.getInvAmount());
		fxMst.setExchRate(fixedAssetTnx.getExchRate());
		fxMst.setTnxCurrency(fixedAssetTnx.getTnxCurrency());
		fxMst.setTnxAmount(fixedAssetTnx.getTnxAmount());
		fxMst.setBookCurrency(fixedAssetTnx.getBookCurrency());
		fxMst.setBookAmt(fixedAssetTnx.getBookAmt());
		fxMst.setPurchaseDate(new Date());
		fxMst.setAssetDesc1(fixedAssetTnx.getAssetDesc1());
		fxMst.setAssetDesc2(fixedAssetTnx.getAssetDesc2());
		fxMst.setAssetModel(fixedAssetTnx.getAssetModel());
		fxMst.setSerialNo(fixedAssetTnx.getSerialNo());
		fxMst.setUniqueId(fixedAssetTnx.getUniqueId());
		fxMst.setAssetQuantity(fixedAssetTnx.getAssetQuantity());			
		fxMst.setBranchCode(fixedAssetTnx.getBranchCode());
		fxMst.setDeptCode(fixedAssetTnx.getDeptCode());
		fxMst.setDepMethod(fixedAssetTnx.getDepMethod());
		fxMst.setDepRate(fixedAssetTnx.getDepRate());
		fxMst.setDepUsefulLife(fixedAssetTnx.getDepUsefulLife());
		fxMst.setDepCollFrequency(fixedAssetTnx.getDepCollFrequency());
		fxMst.setResidualCurrency(fixedAssetTnx.getResidualCurrency());
		fxMst.setResidualValue(fixedAssetTnx.getResidualValue());
		fxMst.setAccumDepCurrency(fixedAssetTnx.getAccumDepCurrency());
		fxMst.setAccumDepAmt(fixedAssetTnx.getAccumDepAmt());	
		fxMst.setDepSequence(0);
		fxMst.setNetAssetCurrency(fixedAssetTnx.getNetAssetCurrency());
		fxMst.setNetAssetAmount(fixedAssetTnx.getNetAssetAmount());
		fxMst.setVendorCode(fixedAssetTnx.getVendorCode());
		fxMst.setVendorName(fixedAssetTnx.getVendorName());
		fxMst.setTnxType(fixedAssetTnx.getTnxType());
		return fixedAssetRepository.save(fxMst);
	}

	@Override
	public List<FixedAsset> listForAmend() {
		List<FixedAsset> amendList = new ArrayList<>();
		List<FixedAsset> list = (List<FixedAsset>) fixedAssetRepository.findAll();
		if (list != null && !list.isEmpty()) {
			for (int i=0; i<list.size(); i++) {
			    FixedAsset fa = new FixedAsset();
			    fa = list.get(i);
			    fa.setAmend(true);
			    
			    amendList.add(fa);
			}
		}
		System.out.println("amend list " + amendList);
		return amendList;
	}

	@Override
	public FixedAsset requestDataForAmend(String fixedAssetSeqId) throws FamApplicationException, SQLException {
		
		System.out.println("Request Data For Amend");
		FixedAssetTnx tnx = new FixedAssetTnx();
		PictureAndQRInfo img = new PictureAndQRInfo();	
		FixedAssetAdditionalInfo addl = new FixedAssetAdditionalInfo();
		FixedAsset fa = fixedAssetRepository.findByFixedAssetMstSeqId(fixedAssetSeqId);
		if (fa != null) {
			addl = fixedAssetAdditionalInfoRepository.findByProdRefId(fa.getProdRefId());
			if (addl != null) {
				fa.setAddlInfo(addl);
			}
			
			img = pictureAndQRInfoRepository.findByProdRefId(fa.getProdRefId());
			if (img != null) {
				fa.setImgInfo(img);
			}	
			fa.setAmend(true);
		}
		System.out.println("Amend Data " + fa);
		return fa;
	}
	
	@Override
	public FixedAsset requestDataForAmendApproval(String fixedAssetTnxSeqId) throws FamApplicationException, SQLException {
		
		System.out.println("Request Data For Amend Approval");
		FixedAssetTnx tnx = fixedAssetTnxRepository.findByFixedAssetTnxSeqId(fixedAssetTnxSeqId);
		PictureAndQRInfo img = new PictureAndQRInfo();	
		FixedAssetAdditionalInfo addl = new FixedAssetAdditionalInfo();
		FixedAsset fx = new FixedAsset();
		if (tnx != null) {
			FixedAssetAdditionalInfoTnx addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);
			if (addlTnx != null) {
				addl.setFixedAssetAddlTnxSeqId(addlTnx.getFixedAssetAddlTnxSeqId());
				addl.setEntity(addlTnx.getEntity());
				addl.setProductCode(addlTnx.getProductCode());
				addl.setProdRefId(addlTnx.getProdRefId());
				addl.setBusinessDate(addlTnx.getBusinessDate());
				addl.setNote1(addlTnx.getNote1());
				addl.setNote2(addlTnx.getNote2());
				addl.setNote3(addlTnx.getNote3());
				addl.setNote4(addlTnx.getNote4());
				addl.setInsuranceName(addlTnx.getInsuranceName());
				addl.setInsuranceCode(addlTnx.getInsuranceCode());
				addl.setInsuranceType(addlTnx.getInsuranceType());
				addl.setInsuranceFrom(addlTnx.getInsuranceFrom());
				addl.setInsuranceTo(addlTnx.getInsuranceTo());
				addl.setWarrantyName(addlTnx.getWarrantyName());
				addl.setWarrantyCode(addlTnx.getWarrantyCode());
				addl.setWarrantyType(addlTnx.getWarrantyType());
				addl.setWarrantyFrom(addlTnx.getWarrantyFrom());
				addl.setWarrantyTo(addlTnx.getWarrantyTo());
				addl.setSupportName(addlTnx.getSupportName());
				addl.setSupportCode(addlTnx.getSupportCode());
				addl.setSupportType(addlTnx.getSupportType());
				addl.setSupportFrom(addlTnx.getSupportFrom());
				addl.setSupportTo(addlTnx.getSupportTo());
				addl.setTaxType(addlTnx.getTaxType());
				addl.setTaxName(addlTnx.getTaxName());
				addl.setTaxRate(addlTnx.getTaxRate());
				addl.setTaxCurrency(addlTnx.getTaxCurrency());
				addl.setTaxAmount(addlTnx.getTaxAmount());
				addl.setFinanceType(addlTnx.getFinanceType());
				addl.setFinanceCode(addlTnx.getFinanceCode());
				addl.setFinanceName(addlTnx.getFinanceName());
				addl.setFinanceCurrency(addlTnx.getFinanceCurrency());
				addl.setFinanceAmt(addlTnx.getFinanceAmt());
				addl.setRate(addlTnx.getRate());
				addl.setFinanceFrom(addlTnx.getFinanceFrom());
				addl.setFinanceTo(addlTnx.getFinanceTo());
			}
			
			PictureAndQRInfoTnx imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
			if (imgTnx != null) {
				img.setPictureAndQrTnxSeqId(imgTnx.getPictureAndQrTnxSeqId());
				img.setEntity(imgTnx.getEntity());
				img.setProductCode(imgTnx.getProductCode());
				img.setProdRefId(imgTnx.getProdRefId());
				img.setBusinessDate(imgTnx.getBusinessDate());
				img.setTrackingCode(imgTnx.getTrackingCode());
				img.setTrackingFileName(imgTnx.getTrackingFileName());
				img.setTrackingFileLocation(imgTnx.getTrackingFileLocation());
				img.setTrackingCreateDate(imgTnx.getTrackingCreateDate());
				img.setVerifiedCode(imgTnx.getVerifiedCode());
				img.setVerifiedFileName(imgTnx.getVerifiedFileName());
				img.setVerifiedFileLocation(imgTnx.getVerifiedFileLocation());
				img.setVerifiedDate(imgTnx.getVerifiedDate());
				img.setPictureCode(imgTnx.getPictureCode());
				img.setPictureFileName(imgTnx.getPictureFileName());
				img.setPictureFileLocation(imgTnx.getPictureFileLocation());
				img.setPictureCaptureDate(imgTnx.getPictureCaptureDate());
			}
		
			fx.setEntity(tnx.getEntity());
			fx.setProductCode(tnx.getProductCode());
			fx.setAssetType(tnx.getAssetType());
			fx.setAssetSubType(tnx.getAssetSubType());
			fx.setProdRefId(tnx.getProdRefId());
			fx.setBusinessDate(tnx.getBusinessDate());
			fx.setInvoiceDate(tnx.getInvoiceDate());
			fx.setInvoiceRef(tnx.getInvoiceRef());
			fx.setInvUnitPrice(tnx.getInvUnitPrice());
			fx.setInvQuantity(tnx.getInvQuantity());
			fx.setInvCurrency(tnx.getInvCurrency());
			fx.setInvAmount(tnx.getInvAmount());
			fx.setExchRate(tnx.getExchRate());
			fx.setTnxCurrency(tnx.getTnxCurrency());
			fx.setTnxAmount(tnx.getTnxAmount());
			fx.setBookCurrency(tnx.getBookCurrency());
			fx.setBookAmt(tnx.getBookAmt());
			fx.setPurchaseDate(tnx.getPurchaseDate());
			fx.setAssetDesc1(tnx.getAssetDesc1());
			fx.setAssetDesc2(tnx.getAssetDesc2());
			fx.setAssetModel(tnx.getAssetModel());
			fx.setSerialNo(tnx.getSerialNo());
			fx.setUniqueId(tnx.getUniqueId());
			fx.setAssetQuantity(tnx.getAssetQuantity());			
			fx.setBranchCode(tnx.getBranchCode());
			fx.setDeptCode(tnx.getDeptCode());
			fx.setDepMethod(tnx.getDepMethod());
			fx.setDepRate(tnx.getDepRate());
			fx.setDepUsefulLife(tnx.getDepUsefulLife());
			fx.setDepCollFrequency(tnx.getDepCollFrequency());
			fx.setResidualCurrency(tnx.getResidualCurrency());
			fx.setResidualValue(tnx.getResidualValue());
			fx.setAccumDepCurrency(tnx.getAccumDepCurrency());
			fx.setAccumDepAmt(tnx.getAccumDepAmt());	
			fx.setDepSequence(tnx.getDepSequence());
			fx.setNetAssetCurrency(tnx.getBookCurrency());
			fx.setNetAssetAmount(tnx.getNetAssetAmount());
			fx.setVendorCode(tnx.getVendorCode());
			fx.setVendorName(tnx.getVendorName());
			fx.setProdStatusCode(tnx.getProdStatusCode());
			fx.setFixedAssetTnxSeqId(tnx.getFixedAssetTnxSeqId());
			// fx.setFixedAssetMstSeqId(tnx.getFixedAsset().getFixedAssetMstSeqId());
			fx.setAmendApprove(true);
			fx.setAddlInfo(addl);
			fx.setImgInfo(img);		
		}
		return fx;
	}

	@Override
	@Transactional("transactionManager")
	public FixedAsset requestForAmend(FixedAsset fixedAsset) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		FixedAsset checkFixedAsset = fixedAssetRepository.findByProdRefId(fixedAsset.getProdRefId());		
		CustomIdGeneration idGen = new CustomIdGeneration();
		
		System.out.println("check fixed asset " + checkFixedAsset);		
		if (checkFixedAsset != null ) {			
			System.out.println("mst id " + fixedAsset.getFixedAssetMstSeqId());
			FixedAssetTnx tnx = new FixedAssetTnx();
			/*if (fixedAsset.getFixedAssetMstSeqId() == null || fixedAsset.getFixedAssetTnxSeqId().isEmpty()) {
				tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
			} else {
				tnx.setFixedAssetTnxSeqId(fixedAsset.getFixedAssetTnxSeqId());
			}	*/			
			tnx.setFixedAssetTnxSeqId(idGen.generateTxnId(new Date()));
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
			tnx.setBookAmt(fixedAsset.getTnxAmount());
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
			tnx.setNetAssetCurrency(fixedAsset.getBookCurrency());
			tnx.setNetAssetAmount(fixedAsset.getNetAssetAmount());
			tnx.setVendorCode(fixedAsset.getVendorCode());
			tnx.setVendorName(fixedAsset.getVendorName());
			// tnx.setFixedAsset(fixedAsset);
			tnx.setProdStatusCode("02");
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("20");
			if (checkFixedAsset.getBookAmt().doubleValue() > fixedAsset.getBookAmt().doubleValue()) {
				tnx.setTnxSubType("22");
			} else {
				tnx.setTnxSubType("21");
			}			
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			fixedAssetTnxRepository.save(tnx);
			
			System.out.println("before checking null.");
			if (fixedAsset.getAddlInfo() != null) {
				System.out.println("param not null.");				
				FixedAssetAdditionalInfoTnx addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);				
				if (addlTnx == null || addlTnx.equals(null)) {
					System.out.println("addlTnx null.");
					addlTnx = new FixedAssetAdditionalInfoTnx();
					addlTnx.setFixedAssetAddlTnxSeqId(idGen.generateTxnId(new Date()));
					System.out.println("addl gnid " + addlTnx.getFixedAssetAddlTnxSeqId());
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
				// addlTnx.setFixedAssetAdditionalInfo(fixedAsset.getAddlInfo());
				addlTnx.setFixedAssetTnx(tnx);
				
				fixedAssetAdditionalInfoTnxRepository.save(addlTnx);
			}
			
			if (fixedAsset.getImgInfo() != null) {
				
				PictureAndQRInfoTnx imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
				if (imgTnx == null || imgTnx.equals(null)) {
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
				// imgTnx.setPictureAndQRInfo(fixedAsset.getImgInfo());
				imgTnx.setFixedAssetTnx(tnx);
				
				pictureAndQRInfoTnxRepository.save(imgTnx);
				
			}	
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Product " + fixedAsset.getProdRefId() + " is requested for amend."));
			apiMsg.setMessage("Product " + fixedAsset.getProdRefId() + " is requested for amend.");
			
		} else {			
			FixedAsset errFa = new FixedAsset();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Product Not Found."));
			err.setMessage("Product " + fixedAsset.getProdRefId() + " not found.");
			// fixedAsset.setApiError(err);
			
			throw new FamApplicationException("Product " + fixedAsset.getProdRefId() + " not found.");
		}
		return fixedAsset;
	}

	@Override
	@Transactional("transactionManager")
	public FixedAsset amendApprove(FixedAsset fixedAsset) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		Calendar cal = Calendar.getInstance();
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		FixedAsset checkFixedAsset = fixedAssetRepository.findByProdRefId(fixedAsset.getProdRefId());		
		CustomIdGeneration idGen = new CustomIdGeneration();
		System.out.println("check fixed asset " + checkFixedAsset);
		FixedAssetTnx tnx = fixedAssetTnxRepository.findByFixedAssetTnxSeqId(fixedAsset.getFixedAssetTnxSeqId());
		
		if (checkFixedAsset != null ) {			
			if(codeValue != null && !codeValue.isEmpty()) {
				fixedAsset.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			//fixedAsset.setFixedAssetMstSeqId(checkFixedAsset.getFixedAssetMstSeqId());
			checkFixedAsset.setTnxAmount(fixedAsset.getTnxAmount());
			checkFixedAsset.setBookAmt(fixedAsset.getBookAmt());
			checkFixedAsset.setBusinessDate(new Date());
			checkFixedAsset.setProdStatusCode("02");
			checkFixedAsset.setTnxType("20");
			checkFixedAsset.setRegister(false);
			checkFixedAsset.setDraft(false);
			checkFixedAsset.setAmend(false);
			checkFixedAsset.setAmendApprove(true);
			checkFixedAsset.setNeedDepreciate(true);			
			Date purchaseDate = fixedAsset.getPurchaseDate();
			Date lastCollectionDate = fixedAsset.getLastCollectionDate();
			if (fixedAsset.getLastCollectionDate() != null) {
				if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("M")) {
					
					cal.setTime(lastCollectionDate);
					cal.add(Calendar.MONTH, 1);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("Q")) {
					
					cal.setTime(lastCollectionDate);
					cal.add(Calendar.MONTH, 3);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("H")) {
					
					cal.setTime(lastCollectionDate);
					cal.add(Calendar.MONTH, 6);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("Y")) {
					
					cal.setTime(lastCollectionDate);
					cal.add(Calendar.MONTH, 6);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				}
				
			} else {
				
				if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("M")) {
					
					cal.setTime(purchaseDate);
					cal.add(Calendar.MONTH, 1);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("Q")) {
					
					cal.setTime(purchaseDate);
					cal.add(Calendar.MONTH, 3);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("H")) {
					
					cal.setTime(purchaseDate);
					cal.add(Calendar.MONTH, 6);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				} else if (fixedAsset.getDepCollFrequency().equalsIgnoreCase("Y")) {
					
					cal.setTime(purchaseDate);
					cal.add(Calendar.MONTH, 6);
					Date nextCollectionDate = cal.getTime();
					System.out.println("nextCollectionDate " + nextCollectionDate);
					checkFixedAsset.setNextCollectionDate(nextCollectionDate);
				}
			}			
				
			tnx.setFixedAsset(checkFixedAsset);
			tnx.setBusinessDate(new Date());
			tnx.setTnxType("20");
			if (checkFixedAsset.getBookAmt().doubleValue() > fixedAsset.getBookAmt().doubleValue()) {
				tnx.setTnxSubType("22");
			} else {
				tnx.setTnxSubType("21");
			}
			tnx.setTnxStatusCode("03");
			tnx.setApproveUser(loginUser.getUsername());
			tnx.setApproveDate(new Date());
			
			FixedAssetAdditionalInfoTnx addlTnx = fixedAssetAdditionalInfoTnxRepository.findByfixedAssetTnx(tnx);
			FixedAssetAdditionalInfo addl = fixedAssetAdditionalInfoRepository.findByProdRefId(fixedAsset.getProdRefId());
			
			addl.setEntity(fixedAsset.getEntity());
			addl.setProductCode(fixedAsset.getProductCode());
			addl.setProdRefId(fixedAsset.getProdRefId());
			addl.setBusinessDate(new Date());
			addl.setNote1(fixedAsset.getAddlInfo().getNote1());
			addl.setNote2(fixedAsset.getAddlInfo().getNote2());
			addl.setNote3(fixedAsset.getAddlInfo().getNote3());
			addl.setNote4(fixedAsset.getAddlInfo().getNote4());
			addl.setInsuranceName(fixedAsset.getAddlInfo().getInsuranceName());
			addl.setInsuranceCode(fixedAsset.getAddlInfo().getInsuranceCode());
			addl.setInsuranceType(fixedAsset.getAddlInfo().getInsuranceType());
			addl.setInsuranceFrom(fixedAsset.getAddlInfo().getInsuranceFrom());
			addl.setInsuranceTo(fixedAsset.getAddlInfo().getInsuranceTo());
			addl.setWarrantyName(fixedAsset.getAddlInfo().getWarrantyName());
			addl.setWarrantyCode(fixedAsset.getAddlInfo().getWarrantyCode());
			addl.setWarrantyType(fixedAsset.getAddlInfo().getWarrantyType());
			addl.setWarrantyFrom(fixedAsset.getAddlInfo().getWarrantyFrom());
			addl.setWarrantyTo(fixedAsset.getAddlInfo().getWarrantyTo());
			addl.setSupportName(fixedAsset.getAddlInfo().getSupportName());
			addl.setSupportCode(fixedAsset.getAddlInfo().getSupportCode());
			addl.setSupportType(fixedAsset.getAddlInfo().getSupportType());
			addl.setSupportFrom(fixedAsset.getAddlInfo().getSupportFrom());
			addl.setSupportTo(fixedAsset.getAddlInfo().getSupportTo());
			addl.setTaxType(fixedAsset.getAddlInfo().getTaxType());
			addl.setTaxName(fixedAsset.getAddlInfo().getTaxName());
			addl.setTaxRate(fixedAsset.getAddlInfo().getTaxRate());
			addl.setTaxCurrency(fixedAsset.getAddlInfo().getTaxCurrency());
			addl.setTaxAmount(fixedAsset.getAddlInfo().getTaxAmount());
			addl.setFinanceType(fixedAsset.getAddlInfo().getFinanceType());
			addl.setFinanceCode(fixedAsset.getAddlInfo().getFinanceCode());
			addl.setFinanceName(fixedAsset.getAddlInfo().getFinanceName());
			addl.setFinanceCurrency(fixedAsset.getAddlInfo().getFinanceCurrency());
			addl.setFinanceAmt(fixedAsset.getAddlInfo().getFinanceAmt());
			addl.setRate(fixedAsset.getAddlInfo().getRate());
			addl.setFinanceFrom(fixedAsset.getAddlInfo().getFinanceFrom());
			addl.setFinanceTo(fixedAsset.getAddlInfo().getFinanceTo());		
			
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
			addlTnx.setFixedAssetAdditionalInfo(addl);
			addlTnx.setFixedAssetTnx(tnx);
			
			PictureAndQRInfoTnx imgTnx = pictureAndQRInfoTnxRepository.findByFixedAssetTnx(tnx);
			PictureAndQRInfo img = pictureAndQRInfoRepository.findByProdRefId(fixedAsset.getProdRefId());
			
			// img.setPictureAndQrSeqId(idGen.generateTxnId(new Date()));
			img.setEntity(fixedAsset.getEntity());
			img.setProductCode(fixedAsset.getProductCode());
			img.setProdRefId(fixedAsset.getProdRefId());
			img.setBusinessDate(new Date());
			img.setTrackingCode(fixedAsset.getImgInfo().getTrackingCode());
			img.setTrackingFileName(fixedAsset.getImgInfo().getTrackingFileName());
			img.setTrackingFileLocation(fixedAsset.getImgInfo().getTrackingFileLocation());
			img.setTrackingCreateDate(new Date());
			img.setVerifiedCode(fixedAsset.getImgInfo().getVerifiedCode());
			img.setVerifiedFileName(fixedAsset.getImgInfo().getVerifiedFileName());
			img.setVerifiedFileLocation(fixedAsset.getImgInfo().getVerifiedFileLocation());
			img.setVerifiedDate(new Date());
			img.setPictureCode(fixedAsset.getImgInfo().getPictureCode());
			img.setPictureFileName(fixedAsset.getImgInfo().getPictureFileName());
			img.setPictureFileLocation(fixedAsset.getImgInfo().getPictureFileLocation());
			img.setPictureCaptureDate(new Date());
			
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
			imgTnx.setPictureAndQRInfo(img);
			imgTnx.setFixedAssetTnx(tnx);
			
			fixedAssetRepository.save(checkFixedAsset);
			fixedAssetTnxRepository.save(tnx);
			fixedAssetAdditionalInfoRepository.save(addl);
			fixedAssetAdditionalInfoTnxRepository.save(addlTnx);
			pictureAndQRInfoRepository.save(img);
			pictureAndQRInfoTnxRepository.save(imgTnx);
			
		} else {
			FixedAsset errFa = new FixedAsset();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Product Not Found."));
			err.setMessage("Product " + fixedAsset.getProdRefId() + " not found.");
			// fixedAsset.setApiError(err);
			
			throw new FamApplicationException("Product " + fixedAsset.getProdRefId() + " not found.");
		}
		
		return fixedAsset;
	}
	
	@Override
	public GraphDto findByAssetType() {
		List<AssetDto> faList = fixedAssetRepository.findByAssetType();
		List<BigDecimal> dataList = new ArrayList<>();
		List<String> labelList = new ArrayList<>();
		for (AssetDto fa : faList) {
			dataList.add(fa.getData());
			labelList.add(fa.getLabel());
		}
		GraphDto dto = new GraphDto();
		dto.setData(dataList.toArray());
		dto.setLabels(labelList.toArray());
		return dto;
	}

	@Override
	public FixedAsset approveForDispose(FixedAssetTnx fxTnx) throws FamApplicationException {
		// TODO Auto-generated method stub	FixedAsset fxMst = fxTnx.getFixedAsset();
		
		System.out.println("555555555555555555555" + fxTnx);
		FixedAsset fxMst = fxTnx.getFixedAsset();
		FixedAsset  saveDataFxMst = this.swapFixedAssetMstBean(fxTnx, fxMst);
		fxTnx.setFixedAsset(saveDataFxMst);
		fxTnx.setApproveDate(new Date());
		fxTnx.setApproveUser(accountHelperImpl.getLoginUser().getUsername());
		fixedAssetTnxRepository.save(fxTnx);
		FixedAssetAdditionalInfoTnx addlInfoTnx  = fxTnx.getAddlInfoTnx();
		String prodRefId = addlInfoTnx.getProdRefId();
		FixedAssetAdditionalInfo addlInfoMst = fixedAssetAdditionalInfoRepository.findByProdRefId(prodRefId);
		FixedAssetAdditionalInfo saveAddlInfoMst = this.swapFixedAssetAddlInfoBean(addlInfoTnx,addlInfoMst);

		PictureAndQRInfoTnx pcQRInfoTnx = fxTnx.getImgInfoTnx();
		if(pcQRInfoTnx != null) {
			
		PictureAndQRInfo pcQRInfoMst = pictureAndQRInfoRepository.findByProdRefId(pcQRInfoTnx.getProdRefId());
		
		}
		return saveDataFxMst;
		
	}


}
