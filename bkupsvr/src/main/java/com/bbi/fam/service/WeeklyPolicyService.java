package com.bbi.fam.service;

import com.bbi.fam.model.WeeklyPolicy;

public interface WeeklyPolicyService {
    WeeklyPolicy findOne();
    
    WeeklyPolicy save(WeeklyPolicy weeklyPolicy);
}
