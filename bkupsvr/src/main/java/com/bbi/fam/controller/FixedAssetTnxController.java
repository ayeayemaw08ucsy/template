package com.bbi.fam.controller;

import java.sql.SQLException;
import java.text.ParseException;
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
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.DepreciationPolicyTnx;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;
import com.bbi.fam.model.FixedAssetTnx;
import com.bbi.fam.service.FixedAssetService;
import com.bbi.fam.service.FixedAssetTnxService;
import com.bbi.fam.utils.Common;

@RestController
@RequestMapping(value = "/fixedAssetTnxs")
public class FixedAssetTnxController {
	
	@Autowired
	private FixedAssetTnxService fixedAssetTnxService;
	
	@Autowired
	private FixedAssetService fixedAssetService;
	
	private Common common;
	
	@RequestMapping(value="/fixedAssetTnx", method = RequestMethod.GET)
    public ResponseEntity<List<FixedAssetTnx>> listBranchTnx(){
    	return new ResponseEntity<List<FixedAssetTnx>>(fixedAssetTnxService.findAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/fixedAssetTnx/findBy/{fixedAssetTnxSeqId}", method = RequestMethod.GET)
    public ResponseEntity<FixedAssetTnx> findOne(@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId){
    	return new ResponseEntity<FixedAssetTnx>(fixedAssetTnxService.findOne(fixedAssetTnxSeqId), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/fixedAssetTnx/{tnxStatusCode}/{tnxType}", method = RequestMethod.GET)
    public ResponseEntity<List<FixedAssetTnx>> findByTnxStatusCode(@PathVariable(value = "tnxStatusCode") String tnxStatusCode,@PathVariable(value = "tnxType") String tnxType){
    	List<FixedAssetTnx> list = fixedAssetTnxService.findByTnxStatusCode(tnxStatusCode);
    	System.out.println(list);
    	return new ResponseEntity<List<FixedAssetTnx>>(fixedAssetTnxService.findAllByTnxStatusCodeAndTnxType(tnxStatusCode,tnxType), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/fixedAssetTnx/request/register", method = RequestMethod.POST)
    public ResponseEntity<Object> requestForRegister( @RequestBody FixedAssetTnx fixedAsset){
    	
    	// FixedAssetTnx fixedAsset = fixedAssetTnxService.findOne(fixedAssetTnxSeqId);
        try {
			return new ResponseEntity<Object>(fixedAssetTnxService.requestForRegister(fixedAsset), HttpStatus.OK);
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
    
    @RequestMapping(value = "/fixedAssetTnx/request/complete", method = RequestMethod.POST)
    public ResponseEntity<Object> requestForRegister( @RequestBody FixedAsset fixedAsset){
    	
    	// FixedAssetTnx fixedAsset = fixedAssetTnxService.findOne(fixedAssetTnxSeqId);
        try {
			return new ResponseEntity<Object>(fixedAssetTnxService.completeRegister(fixedAsset), HttpStatus.OK);
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

    @RequestMapping(value = "/fixedAssetTnx/update/{fixedAssetTnxSeqId}", method = RequestMethod.PUT)
    public ResponseEntity<Object> update(@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId, @RequestBody FixedAssetTnx fixedAssetTnx){
    	
    	fixedAssetTnx.setFixedAssetTnxSeqId(fixedAssetTnxSeqId);
        try {
			return new ResponseEntity<Object>(fixedAssetTnxService.update(fixedAssetTnx), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }

    @RequestMapping(value = "/fixedAssetTnx/delete/{fixedAssetTnxSeqId}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId) throws Exception{
    	System.out.println("In the delete controller.");
    	fixedAssetTnxService.delete(fixedAssetTnxSeqId);
    	return new ResponseEntity<Object>(fixedAssetTnxService.delete(fixedAssetTnxSeqId), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/fixedAssetTnx/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> approve(@RequestBody FixedAsset fixedAssetTnx){
    	try {
			return new ResponseEntity<Object>(fixedAssetService.approve(fixedAssetTnx), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (SQLException se) {
			String error = se.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , se.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		} catch (ParseException pe) {
			String error = pe.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , pe.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    	
    }
    
    @RequestMapping(value = "/fixedAssetTnx/update/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> updateApprove(@RequestBody FixedAssetTnx fixedAssetTnx){
    	try {
			return new ResponseEntity<Object>(fixedAssetService.updateApprove(fixedAssetTnx), HttpStatus.OK);
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
    
    @RequestMapping(value = "/fixedAssetTnx/amend/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> updateApprove(@RequestBody FixedAsset fixedAsset){
    	try {
			return new ResponseEntity<Object>(fixedAssetService.amendApprove(fixedAsset), HttpStatus.OK);
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
    
    
   /***/
    @RequestMapping(value="/get-tasks", method = RequestMethod.GET)
    public ResponseEntity<List<FixedAssetTnx>> getTasks(){
    	return new ResponseEntity<List<FixedAssetTnx>>(fixedAssetTnxService.getTasks("ppa"), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/fixedAssetTnx/fixedAssetDraft/{prodRefId}", method = RequestMethod.GET)
    public ResponseEntity<Object> getFixedAssetDraft(@PathVariable(value = "prodRefId") String prodRefId){
    	
        try {
			// return new ResponseEntity<Object>(fixedAssetTnxService.findByProductRefIdAndProdStatusCodeAndTnxStatusCodeAndTnxTypeAndTnxSubType(prodRefId, "01", "01", "10", "11"), HttpStatus.OK);
        	return new ResponseEntity<Object>(fixedAssetTnxService.findByProductRefIdAndProdStatusCodeAndTnxStatusCode(prodRefId, "01", "01"), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }
    
    @RequestMapping(value = "/fixedAssetTnx/fixedAssetDraft/additionalInfo/{fixedAssetTnxSeqId}", method = RequestMethod.GET)
    public ResponseEntity<Object> getFixedAssetDraftAdditionalInfo(@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId){
    	FixedAssetTnx fixedAssetTnx = fixedAssetTnxService.findOne(fixedAssetTnxSeqId);
        try {
        	return new ResponseEntity<Object>(fixedAssetTnxService.findByfixedAssetTnx(fixedAssetTnx), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    
    }
    
    @RequestMapping(value = "/fixedAssetTnx/fixedAssetDraft/imageInfo/{fixedAssetTnxSeqId}", method = RequestMethod.GET)
    public ResponseEntity<Object> getImageInfo(@PathVariable(value = "fixedAssetTnxSeqId") String fixedAssetTnxSeqId){
    	FixedAssetTnx fixedAssetTnx = fixedAssetTnxService.findOne(fixedAssetTnxSeqId);
        try {
        	return new ResponseEntity<Object>(fixedAssetTnxService.findPictureByfixedAssetTnx(fixedAssetTnx), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    
    }
    
    @RequestMapping(value = "/fixedAssetTnx/fixedAssetWaiting", method = RequestMethod.GET)
    public ResponseEntity<List<FixedAsset>> getFixedAssetApprovalWaiting(){
        try {
        	return new ResponseEntity<List<FixedAsset>>(fixedAssetTnxService.findByProdStatusCodeAndTnxStatusCodeAndTnxType("01", "02", "10"), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<List<FixedAsset>>((List<FixedAsset>) apiError, apiError.getStatus());
		}
    }
    
    @RequestMapping(value = "/fixedAssetTnx/draft/fixedAssetPending", method = RequestMethod.GET)
    public ResponseEntity<List<FixedAsset>> getFixedAssetPending(){
        try {
        	return new ResponseEntity<List<FixedAsset>>(fixedAssetTnxService.findByProdStatusCodeAndTnxStatusCodeAndTnxType("01", "01", "10"), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<List<FixedAsset>>((List<FixedAsset>) apiError, apiError.getStatus());
		}
    }
    
    @RequestMapping(value = "/fixedAssetTnx/amend/fixedAssetWaitingApproval", method = RequestMethod.GET)
    public ResponseEntity<List<FixedAsset>> getFixedAssetWaitingAmendApproval(){
        try {
        	return new ResponseEntity<List<FixedAsset>>(fixedAssetTnxService.findByProdStatusCodeAndTnxStatusCodeAndTnxType("02", "02", "20"), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<List<FixedAsset>>((List<FixedAsset>) apiError, apiError.getStatus());
		}
    }


	@RequestMapping(value="/fixedAssetTnx/update/draft", method = RequestMethod.POST)
	public ResponseEntity<Object> updateDraft(@RequestBody FixedAssetTnx fixedAsset) {
		
		try {
			return new ResponseEntity<Object>(fixedAssetTnxService.saveAsDraftForUpdate(fixedAsset),HttpStatus.OK);
			
		}catch(FamApplicationException ex) {
	
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
	
		}
	}
    
	@RequestMapping(value="/fixedAssetTnx/update/dispose", method = RequestMethod.POST)
	public ResponseEntity<Object> disposeDraft(@RequestBody FixedAssetTnx fixedAsset) {
		
		try {
			return new ResponseEntity<Object>(fixedAssetTnxService.saveAsDraftForDispose(fixedAsset),HttpStatus.OK);
			
		}catch(FamApplicationException ex) {
	
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
	
		}
	}
	
	@RequestMapping(value="/fixedAssetTnx/update/complete", method = RequestMethod.POST)
	public ResponseEntity<Object> updateComplete(@RequestBody FixedAssetTnx fixedAsset) {
		
		try {
			return new ResponseEntity<Object>(fixedAssetTnxService.completeForUpdate(fixedAsset),HttpStatus.OK);
			
		}catch(FamApplicationException ex) {
	
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
	
		}
	}
	/**
	 * @ayeayemaw
	 * @param prodRefId
	 * @param fixedAssetMstSeqId
	 * @return
	 */
	@RequestMapping(value="/fixedAssetTnx/update/draft/{prodRefId}/{fixedAssetMstSeqId}" , method = RequestMethod.GET)
	public ResponseEntity<Object> getFixedAssetTnxDataForSaveAsDraft(@PathVariable (value="prodRefId") String prodRefId, @PathVariable (value="fixedAssetMstSeqId") String fixedAssetMstSeqId) {
		FixedAssetTnx tnx=null;  
		try {
			
			//List<FixedAssetTnx> tnxList = (List<FixedAssetTnx>)(fixedAssetTnxService.findAllByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId));
			List<FixedAssetTnx> tnxList = (List<FixedAssetTnx>)(fixedAssetTnxService.findByProdRefIdAndFixedAssetMstSeqId(prodRefId, fixedAssetMstSeqId,Common.TNX_STATUS_CODE[0],Common.TNX_TYPE[2],Common.TNX_SUB_TYPE[5]));
			
		    
			if(tnxList.size() != 0) {
				
		      tnx = tnxList.get(0);  	
		    
			}
			
		} catch (FamApplicationException ex) {
			
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
		return new ResponseEntity<Object>(tnx, HttpStatus.OK);
	}
	
	
	
	/**
	 * @ayeayemaw
	 * @param prodRefId
	 * @param fixedAssetMstSeqId
	 * @return
	 */
	@RequestMapping(value="/fixedAssetAddlTnx/update/draft/{prodRefId}/{addlInfoMstSeqId}/{fixedAssetTnxSeqId}" , method = RequestMethod.GET)
	public ResponseEntity<Object> getFixedAssetAddlTnxDataForSaveAsDraft(@PathVariable (value="prodRefId") String prodRefId, @PathVariable (value="addlInfoMstSeqId")
								String addlInfoMstSeqId, @PathVariable (value="fixedAssetTnxSeqId")String fixedAssetTnxSeqId) {
		FixedAssetAdditionalInfoTnx tnx=null;  
		try {
			
			List<FixedAssetAdditionalInfoTnx> tnxList = fixedAssetTnxService.findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId(prodRefId, addlInfoMstSeqId, fixedAssetTnxSeqId);
		    
			if(tnxList.size() != 0) {
				
		      tnx = tnxList.get(0);  	
		    
			}
			
		} catch (FamApplicationException ex) {
			
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
		return new ResponseEntity<Object>(tnx, HttpStatus.OK);
	} 
	
	
	/**
	 * 
	 * @return
	 */
	 @RequestMapping(value="/get-tasks/pending", method = RequestMethod.GET)
	 public ResponseEntity<List<FixedAssetTnx>> getPendingTasks(){
	    	return new ResponseEntity<List<FixedAssetTnx>>(fixedAssetTnxService.getPendingTasks("ppa"), HttpStatus.OK);
	   }
	

		/**
		 * 
		 * @return
		 */
	  @RequestMapping(value="/get-tasks/dispose/pending", method = RequestMethod.GET)
      public ResponseEntity<List<FixedAssetTnx>> getPendingDisposeTasks(){
		    	return new ResponseEntity<List<FixedAssetTnx>>(fixedAssetTnxService.getPendingDisposeTasks("ppa"), HttpStatus.OK);
       }
		
		 
	 /**
		 * 
		 * @return
		 */
	@RequestMapping(value="/get-tasks/complete", method = RequestMethod.GET)
	public ResponseEntity<List<FixedAssetTnx>> getCompleteingTasks(){
		   return new ResponseEntity<List<FixedAssetTnx>>(fixedAssetTnxService.getCompletingTasks("ppa"), HttpStatus.OK);
		
	 }
	
	
	@RequestMapping(value="/fixedAssetTnx/dispose/complete", method = RequestMethod.POST)
	public ResponseEntity<Object> disposeComplete(@RequestBody FixedAssetTnx fixedAsset) {
		
		try {
			return new ResponseEntity<Object>(fixedAssetTnxService.completeForDispose(fixedAsset),HttpStatus.OK);
			
		}catch(FamApplicationException ex) {
	
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
	
		}
	}
}