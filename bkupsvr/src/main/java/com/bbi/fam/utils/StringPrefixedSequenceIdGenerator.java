package com.bbi.fam.utils;

import java.io.Serializable;
import java.util.Properties;

import org.hibernate.HibernateException;
import org.hibernate.MappingException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.enhanced.SequenceStyleGenerator;
import org.hibernate.internal.util.config.ConfigurationHelper;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.LongType;
import org.hibernate.type.Type;

import com.bbi.fam.model.Product;

public class StringPrefixedSequenceIdGenerator extends SequenceStyleGenerator{
	private String format;
	
	@Override
	public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
		return String.format(format, ((Product) object).getPrefix() ,super.generate(session, object));
	}

	@Override
	public void configure(Type type, Properties params, ServiceRegistry serviceRegistry) throws MappingException {
		super.configure(LongType.INSTANCE, params, serviceRegistry);
		String codeNumberSeparator = ConfigurationHelper.getString("codeNumberSeparator", params, "");
		String numberFormat = ConfigurationHelper.getString("numberFormat", params, "%08d").replace("%", "%2$");
		format = "%1$s"  + codeNumberSeparator + numberFormat;
	}
	
}
