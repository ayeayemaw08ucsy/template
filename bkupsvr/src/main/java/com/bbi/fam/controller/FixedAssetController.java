package com.bbi.fam.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.FixedAssetTnx;
import com.bbi.fam.service.FixedAssetService;
import com.bbi.fam.service.FixedAssetTnxService;
import com.bbi.fam.utils.CustomIdGeneration;
import com.bbi.fam.model.FixedAssetAdditionalInfo;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;
import com.bbi.fam.model.PictureAndQRInfo;
import com.bbi.fam.service.FixedAssetAdditionalInfoService;
import com.bbi.fam.service.PictureAndQRInfoService;

@RestController
@RequestMapping(value = "/fixedAssets")
public class FixedAssetController {
	
	@Autowired
	private FixedAssetService fixedAssetService;
	
	@Autowired
	private FixedAssetTnxService fixedAssetTnxService;
	
	@Autowired
	private FixedAssetAdditionalInfoService addlInfoService;
	
	@Autowired
	private PictureAndQRInfoService pictureAndQRInfoService;
	
	@RequestMapping(value = "/fixedAsset", method = RequestMethod.POST)
	public ResponseEntity<Object> create(@RequestBody FixedAsset fixedAsset){
		
		try {
			return new ResponseEntity<Object>(fixedAssetService.register(fixedAsset), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (SQLException se) {
			String error = se.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , se.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }
	
	@RequestMapping(value = "/fixedAsset/productRef/{branchCode}/{accessType}", method = RequestMethod.POST)
	public ResponseEntity<Object> getProductRef(@PathVariable String branchCode, @PathVariable String accessType){
		
		CustomIdGeneration idGen = new CustomIdGeneration();
		String prodRefId = idGen.generateProductId(branchCode, new Date(), accessType);
		System.out.println("prod ref " + prodRefId);
		return new ResponseEntity<Object>(prodRefId, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/fixedAsset/draft", method = RequestMethod.POST)
	public ResponseEntity<Object> draft(@RequestBody FixedAssetTnx fixedAsset){
		
		try {
			return new ResponseEntity<Object>(fixedAssetService.saveAsDraft(fixedAsset), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (SQLException se) {
			String error = se.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , se.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }
	
	 @RequestMapping(value="/fixedAsset", method = RequestMethod.GET)
	 public ResponseEntity<List<FixedAsset>> listFixedAsset(){
	    return new ResponseEntity<List<FixedAsset>>(fixedAssetService.findAllByOrderByBusinessDate(), HttpStatus.OK);
	 }

	@RequestMapping(value = "/fixedAsset/{fixedAssetSeqId}", method = RequestMethod.GET)
	public ResponseEntity<FixedAsset> findOne(@PathVariable String fixedAssetSeqId) {
		return new ResponseEntity<FixedAsset>(fixedAssetService.findOne(fixedAssetSeqId), HttpStatus.OK);
	}

	@RequestMapping(value = "/fixedAsset/{fixedAssetSeqId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> update(@PathVariable String fixedAssetSeqId, @RequestBody FixedAsset fixedAsset) {
		fixedAsset.setFixedAssetMstSeqId(fixedAssetSeqId);
		 try {
				return new ResponseEntity<Object>(fixedAssetService.update(fixedAsset), HttpStatus.OK);
			} catch (FamApplicationException ex) {
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
	}

	@RequestMapping(value = "/fixedAsset/{fixedAssetSeqId}/delete", method = RequestMethod.DELETE)
	public ResponseEntity<FixedAsset> delete(@PathVariable(value = "fixedAssetSeqId") String fixedAssetSeqId) throws Exception {
		// fixedAssetService.delete(fixedAssetSeqId);
		return new ResponseEntity<FixedAsset>(fixedAssetService.delete(fixedAssetSeqId), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/fixedAsset/request/update/{fixedAssetTnxSeqId}", method = RequestMethod.GET)
	public ResponseEntity<Object> requestForUpdate(
			@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId) {

		try {
			return new ResponseEntity<Object>(fixedAssetService.requestForUpdate(fixedAssetTnxSeqId), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (SQLException se) {
			String error = se.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, se.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
	}
	
	@RequestMapping(value = "/fixedAsset/request/amend/{fixedAssetMstSeqId}", method = RequestMethod.GET)
	public ResponseEntity<Object> requestDataForAmend(@PathVariable(value = "fixedAssetMstSeqId") String fixedAssetMstSeqId) {

		try {
			return new ResponseEntity<Object>(fixedAssetService.requestDataForAmend(fixedAssetMstSeqId), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (SQLException se) {
			String error = se.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, se.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
	}
	
	@RequestMapping(value = "/fixedAsset/request/amend", method = RequestMethod.POST)
	public ResponseEntity<Object> requestForAmend(@RequestBody FixedAsset fixedAsset) {

		try {
			return new ResponseEntity<Object>(fixedAssetService.requestForAmend(fixedAsset), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (SQLException se) {
			String error = se.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, se.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
	}
	 
	 @RequestMapping(value="/fixedAsset/amend", method = RequestMethod.GET)
	 public ResponseEntity<List<FixedAsset>> listForAmendFixedAsset(){
	    return new ResponseEntity<List<FixedAsset>>(fixedAssetService.listForAmend(), HttpStatus.OK);
	 }
	 
	 @RequestMapping(value = "/fixedAsset/request/amendApproval/{fixedAssetTnxSeqId}", method = RequestMethod.GET)
		public ResponseEntity<Object> requestDataForAmendApproval(@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId) {

			try {
				return new ResponseEntity<Object>(fixedAssetService.requestDataForAmendApproval(fixedAssetTnxSeqId), HttpStatus.OK);
			} catch (FamApplicationException ex) {
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			} catch (SQLException se) {
				String error = se.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, se.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
	    }
	 
	 /***/
	 @RequestMapping(value="/existing/{prodRefId}", method= RequestMethod.GET) 
	 public ResponseEntity<Object> loadMstDataByProdRefId(@PathVariable(value = "prodRefId") String prodRefId) {
	  try {
	    	   FixedAsset fixedAssetMst = new FixedAsset();
	    	   FixedAssetAdditionalInfoTnx addlInfoTnx = null;
		  	   FixedAssetAdditionalInfo addlInfoMst = addlInfoService.findByProdRefId(prodRefId);
		  	   PictureAndQRInfo pcQRInfoMst = pictureAndQRInfoService.findByprodRefId(prodRefId);
		  	   
		  	   fixedAssetMst.setAddlInfoMst(addlInfoMst);
		  	   fixedAssetMst.setPictureAndQRInfoMst(pcQRInfoMst);
		  	   
		  	   System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$"+prodRefId);
		  	 System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$"+addlInfoMst.getFixedAssetAddlMstSeqId());
		  	   List<FixedAssetAdditionalInfoTnx> addlTnxList = fixedAssetTnxService.findAllByProdRefIdAndFixedAssetAddlMstSeqId(prodRefId,addlInfoMst.getFixedAssetAddlMstSeqId());
		  	   
		  	   if(addlTnxList.size() != 0) {
		  		   addlInfoTnx = addlTnxList.get(0);
		  		 addlInfoTnx.setFixedAssetAdditionalInfo(addlInfoMst);
		  	   }
		  	   
		  	   fixedAssetMst.setAddlInfoTnx(addlInfoTnx);
		  	   
		  	   return new ResponseEntity<Object>(fixedAssetMst,HttpStatus.OK);
			} catch (FamApplicationException e) {
				
				String error = e.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , e.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
		}
	 
	 @RequestMapping(value="/update/approve", method = RequestMethod.POST)
		public ResponseEntity<Object> updateApproval(@RequestBody FixedAssetTnx fixedAsset) {
			
			try {
				return new ResponseEntity<Object>(fixedAssetService.approveForUpdate(fixedAsset),HttpStatus.OK);
				
			}catch(FamApplicationException ex) {
		
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
		
			}
		}
	 
	 @RequestMapping(value="/dispose/approve", method = RequestMethod.POST)
		public ResponseEntity<Object> disposeApproval(@RequestBody FixedAssetTnx fixedAsset) {
			
			try {
				return new ResponseEntity<Object>(fixedAssetService.approveForDispose(fixedAsset),HttpStatus.OK);
				
			}catch(FamApplicationException ex) {
		
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
		
			}
		}

//	 @RequestMapping(value="/fixedAsset/{tnxStatusCode}/{tnxType}", method = RequestMethod.GET)
//	 public ResponseEntity<List<FixedAsset>> getApprovedDataList(@PathVariable(value = "tnxStatusCode" )String statusCode,@PathVariable(value = "tnxType") String tnxType){
//		 
//			List<FixedAssetTnx> fixedAssetTnxLst = fixedAssetTnxService.findAllByTnxStatusCodeAndTnxType(statusCode, tnxType);
//			List<FixedAsset> fixedAssetLst = new ArrayList<FixedAsset>();
//			for(FixedAssetTnx tnx: fixedAssetTnxLst ) {
//				fixedAssetLst.add(tnx.getFixedAsset());
//			}
//			System.out.println("#########################FixedAsset Approved List%%%%%%%%%%%%" + fixedAssetLst.toString());
//			return new ResponseEntity<List<FixedAsset>>(fixedAssetLst, HttpStatus.OK);
//		
//	 }
}