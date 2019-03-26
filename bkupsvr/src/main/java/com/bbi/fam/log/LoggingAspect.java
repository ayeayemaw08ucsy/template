package com.bbi.fam.log;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;

import com.bbi.fam.helper.AccountHelper;

@Aspect
@Component
public class LoggingAspect {

	private static final String MDC_KEY_SESSIONID = "sessionId";

	private static final String MDC_KEY_IP_ADDRESS = "ipAddress";

	private static final String MDC_KEY_USER_ID = "userId";

	@Autowired
	private HttpServletRequest request;

	@Autowired
	private AccountHelper accountHelper;

	private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

	@Pointcut(value = "execution(public * *(..)) && within(com.bbi.fam.service..*)")
	private void logServicePointcut() {
	}

	@Pointcut(value = "execution(public * *(..)) && within(com.bbi.fam.controller..*)")
	private void logControllerPointcut() {
	}

	@Before("logControllerPointcut() || logServicePointcut()")
	public void loggingServiceBefore(JoinPoint jointPoint) {
		MDC.clear();
		String username = null;
		if(accountHelper.getLoginUser() != null) {
			username = accountHelper.getLoginUser().getUsername();
		}
		Signature signature = jointPoint.getSignature();

		if (RequestContextHolder.getRequestAttributes() != null) {
			MDC.putCloseable(MDC_KEY_IP_ADDRESS, request.getRemoteAddr());
			if (request.getSession() != null) {
				MDC.putCloseable(MDC_KEY_SESSIONID, request.getSession().getId());
			}
			
			MDC.putCloseable(MDC_KEY_USER_ID, username);
		}
		
		logger.debug(signature.toString() + " method has been started by " + username);
	}

	@AfterReturning("logControllerPointcut() || logServicePointcut()")
	public void loggingServiceAfterReturn(JoinPoint joinPoint) {
		Signature signature = joinPoint.getSignature();
		logger.debug(signature.toString() + " method has successfully finished.");
	}

	@AfterThrowing(pointcut = "logControllerPointcut() || logServicePointcut()", throwing = "e")
	public void loggingServiceAfterThrow(JoinPoint joinPoint, Throwable e) {
		Signature signature = joinPoint.getSignature();
		logger.error(signature.toString() + "method has failed.");
		logger.error("Exception is ", e);
	}
}
