package com.bbi.fam.dao;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.UserLimitMaster;

@Repository
public interface UserLimitMasterRepository extends CrudRepository<UserLimitMaster, String> {
	public List<UserLimitMaster> findByLevelCode(String levelCode);
	public List<UserLimitMaster> findByInputLimitAndApproveLimit(BigDecimal inputLimit, BigDecimal approveLimit);

}
