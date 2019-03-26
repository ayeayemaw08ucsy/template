package com.bbi.fam.config;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.collections4.map.HashedMap;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.launch.support.SimpleJobLauncher;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.PlatformTransactionManager;

import com.bbi.fam.dao.BatchJobHistoryRepository;
import com.bbi.fam.dao.DepreciationProcessMstRepository;
import com.bbi.fam.dao.DepreciationProcessTxnRepository;
import com.bbi.fam.dao.FamJobRepository;
import com.bbi.fam.dao.PostingRepository;
import com.bbi.fam.model.BatchJobHistory;
import com.bbi.fam.model.DepPostingTxn;
import com.bbi.fam.model.DepreciationProcessMst;
import com.bbi.fam.model.DepreciationProcessTxn;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.Notifications;
import com.bbi.fam.model.PostingTxn;
import com.bbi.fam.model.User;
import com.bbi.fam.service.HolidayService;
import com.bbi.fam.utils.CustomIdGeneration;

@Configuration
@EnableBatchProcessing
public class BatchConfiguration {

	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	@Autowired
	public StepBuilderFactory stepBuilderFactory;

	@PersistenceContext
	public EntityManager entityManager;

	@Autowired
	private SimpleJobLauncher jobLauncher;

	@Autowired
	private PostingRepository postingRepo;

	@Autowired
	private HolidayService holidayService;

	@Autowired
	private DepreciationProcessTxnRepository depTxnRepo;

	@Autowired
	private DepreciationProcessMstRepository depMstRepo;

	@Autowired
	private FamJobRepository jobRepo;

	@Autowired
	private BatchJobHistoryRepository jobHistoryRepo;

	@Autowired
	private SimpMessagingTemplate template;

	@Value("${fa.fa.account1}")
	private String faAccount1;

	@Value("${fa.fa.account2}")
	private String faAccount2;

	@Value("${fa.ff.account1}")
	private String ffAccount1;

	@Value("${fa.ff.account2}")
	private String ffAccount2;

	@Value("${fa.disposal.account1}")
	private String disposalAccount1;

	@Value("${fa.disposal.account2}")
	private String disposalAccount2;

	@Value("${dep.account1}")
	private String depAccount1;

	@Value("${dep.account2}")
	private String depAccount2;

	@Value("${dep.account3}")
	private String depAccount3;

	@Value("${dep.account4}")
	private String depAccount4;

	@Value("${report.file.dir}")
	private String fileDir;

	@Scheduled(cron = "0 0 18 ? * *")
	public void jobOneLauncher() throws Exception {
		BatchJobHistory job = new BatchJobHistory(jobRepo.findByJobName("EFAA2004"));
		job.setStartDttm(new Date());
		JobParameters param = new JobParametersBuilder().addString("JobID", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
		JobExecution execution = jobLauncher.run(faPosting(), param);
		job.setJobStatus(execution.getStatus().name());
		job.setEndDttm(new Date());
		jobHistoryRepo.save(job);
		System.out.println("Job finished with status :" + execution.getStatus());
	}

	@Scheduled(cron = "0 0 18 ? * *")
	public void depPostingLauncher() throws Exception {
		if (isLastDayOfMonth(new Date())) {
			BatchJobHistory job = new BatchJobHistory(jobRepo.findByJobName("EDAA2006"));
			job.setStartDttm(new Date());
			JobParameters param = new JobParametersBuilder()
					.addString("JobID", String.valueOf(System.currentTimeMillis())).toJobParameters();
			JobExecution execution = jobLauncher.run(depPosting(), param);
			job.setJobStatus(execution.getStatus().name());
			job.setEndDttm(new Date());
			jobHistoryRepo.save(job);
			System.out.println("Job finished with status :" + execution.getStatus());
		}
	}

	@Scheduled(cron = "0 0 17 ? * *")
	public void notifications() throws Exception {
		BatchJobHistory job = new BatchJobHistory(jobRepo.findByJobName("ENTF2000"));
		job.setStartDttm(new Date());
		JobParameters param = new JobParametersBuilder().addString("JobID", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
		JobExecution execution = jobLauncher.run(notificationJob(), param);
		job.setJobStatus(execution.getStatus().name());
		job.setEndDttm(new Date());
		jobHistoryRepo.save(job);
		System.out.println("Job finished with status :" + execution.getStatus());
	}

	/*
	 * @Scheduled(cron = "0 0 18 ? * *") public void jobTwoLauncher() throws
	 * Exception { if (isLastDayOfMonth(new Date())) { BatchJobHistory job = new
	 * BatchJobHistory(jobRepo.findByJobName("EDEP2005")); job.setStartDttm(new
	 * Date()); JobParameters param = new JobParametersBuilder() .addString("JobID",
	 * String.valueOf(System.currentTimeMillis())).toJobParameters(); JobExecution
	 * execution = jobLauncher.run(depProcess(), param);
	 * job.setJobStatus(execution.getStatus().name()); job.setEndDttm(new Date());
	 * jobHistoryRepo.save(job); System.out.println("Job finished with status :" +
	 * execution.getStatus()); } }
	 */

	@Bean
	public JpaItemWriter<PostingTxn> writer() {
		JpaItemWriter<PostingTxn> jpaItemWriter = new JpaItemWriter<>();
		jpaItemWriter.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		return jpaItemWriter;
	}

	@Bean
	public ItemReader<FixedAsset> reader() throws Exception {
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		c.set(Calendar.MILLISECOND, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.HOUR, 0);
		Date start = c.getTime();
		
		Calendar c1 = Calendar.getInstance();
		c1.setTime(new Date());
        c1.set(Calendar.SECOND, 59);
        c1.set(Calendar.MINUTE, 59);
        c1.set(Calendar.HOUR, 23);
		Date end = c1.getTime();
		
		JpaPagingItemReader<FixedAsset> reader = new JpaPagingItemReader<FixedAsset>();
		reader.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		Map<String, Object> params = new HashedMap<>();
		params.put("start", start);
		params.put("end", end);
		reader.setQueryString("select f from FixedAsset f where  f.tnxCurrency = 'MMK' and f.businessDate > :start and f.businessDate < :end");
		reader.setParameterValues(params);
		reader.afterPropertiesSet();
		reader.setSaveState(true);
		return reader;
	}

	@Bean
	public ItemReader<User> notiUser() throws Exception {
		JpaPagingItemReader<User> reader = new JpaPagingItemReader<User>();
		reader.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		reader.setQueryString("select u from User u");
		reader.afterPropertiesSet();
		reader.setSaveState(true);
		return reader;
	}

	@Bean
	public JpaItemWriter<PostingTxn> simpleWriter() {
		JpaItemWriter<PostingTxn> jpaItemWriter = new JpaItemWriter<>();
		jpaItemWriter.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		return jpaItemWriter;
	}

	@Bean
	public ItemReader<PostingTxn> simpleReader() throws Exception {
		JpaPagingItemReader<PostingTxn> reader = new JpaPagingItemReader<PostingTxn>();
		reader.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		reader.setQueryString("select u from PostingTxn u");
		reader.afterPropertiesSet();
		reader.setSaveState(true);
		return reader;
	}

	@Bean
	public JpaItemWriter<DepPostingTxn> depSimpleWriter() {
		JpaItemWriter<DepPostingTxn> jpaItemWriter = new JpaItemWriter<>();
		jpaItemWriter.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		return jpaItemWriter;
	}

	@Bean
	public ItemReader<DepPostingTxn> depSimpleReader() throws Exception {
		JpaPagingItemReader<DepPostingTxn> reader = new JpaPagingItemReader<DepPostingTxn>();
		reader.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		reader.setQueryString("select u from DepPostingTxn u");
		reader.afterPropertiesSet();
		reader.setSaveState(true);
		return reader;
	}

	@Bean
	public ItemProcessor<FixedAsset, PostingTxn> processor() {
		return (item) -> {
			PostingTxn posting = new PostingTxn();
			posting.setTnxType("Batch");
			posting.setTnxSubType("Fixed Asset");
			posting.setProdRefId(item.getProdRefId());
			posting.setEntity(item.getEntity());
			posting.setProdCode(item.getProductCode());
			posting.setTnxId(item.getFixedAssetMstSeqId());
			posting.setDebitCcy(item.getTnxCurrency());
			posting.setCreditCcy(item.getTnxCurrency());
			posting.setBusinessDate(new Date().toString());
			posting.setRefOne(item.getProdRefId());
			posting.setRefTwo(item.getAssetType());
			if (!item.getTnxType().equalsIgnoreCase("03")) {
				if (item.getAssetType().equalsIgnoreCase("VH")) {
					if (item.getTnxAmount().longValueExact() < 0) {
						// Amend decrease
						posting.setDebitAccount(faAccount2);
						posting.setCreditAccount(faAccount1);
						posting.setDebitAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
						posting.setCreditAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
					} else {
						// New and Amend increase
						posting.setDebitAccount(faAccount1);
						posting.setCreditAccount(faAccount2);
						posting.setDebitAmt(item.getTnxAmount());
						posting.setCreditAmt(item.getTnxAmount());
					}

				}

				if (item.getAssetType().equalsIgnoreCase("FF")) {
					if (item.getTnxAmount().longValueExact() < 0) {
						// Amend decrease
						posting.setDebitAccount(ffAccount2);
						posting.setCreditAccount(ffAccount1);
						posting.setDebitAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
						posting.setCreditAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
					} else {
						// New and Amend increase
						posting.setDebitAccount(ffAccount1);
						posting.setCreditAccount(ffAccount2);
						posting.setDebitAmt(item.getTnxAmount());
						posting.setCreditAmt(item.getTnxAmount());
					}
				}
			} else {
				if (item.getResidualValue().longValueExact() > 0) {
					PostingTxn resiTxn = new PostingTxn();
					resiTxn.setTnxType("Batch");
					resiTxn.setTnxSubType("Fixed Asset");
					resiTxn.setProdRefId(item.getProdRefId());
					resiTxn.setEntity(item.getEntity());
					resiTxn.setProdCode(item.getProductCode());
					resiTxn.setTnxId(item.getFixedAssetMstSeqId());
					resiTxn.setDebitCcy(item.getTnxCurrency());
					resiTxn.setCreditCcy(item.getTnxCurrency());
					resiTxn.setBusinessDate(new Date().toString());
					resiTxn.setDebitAccount(disposalAccount2);
					resiTxn.setDebitAmt(item.getResidualValue());
					postingRepo.save(resiTxn);
				}

				if ((item.getResidualValue().longValueExact() + item.getAccumDepAmt().longValueExact()
						+ item.getBookAmt().longValueExact()) > 0) {
					PostingTxn txn = new PostingTxn();
					txn.setTnxType("Batch");
					txn.setTnxSubType("Fixed Asset");
					txn.setProdRefId(item.getProdRefId());
					txn.setEntity(item.getEntity());
					txn.setProdCode(item.getProductCode());
					txn.setTnxId(item.getFixedAssetMstSeqId());
					txn.setDebitCcy(item.getTnxCurrency());
					txn.setCreditCcy(item.getTnxCurrency());
					txn.setBusinessDate(new Date().toString());
					txn.setDebitAccount(ffAccount2);
					txn.setDebitAmt(new BigDecimal(item.getResidualValue().longValueExact()
							+ item.getAccumDepAmt().longValueExact() + item.getBookAmt().longValueExact()));
					postingRepo.save(txn);
				}

				if (item.getAssetType().equalsIgnoreCase("VH")) {
					if (item.getBookAmt().longValueExact() < 0) {
						posting.setDebitAccount(disposalAccount1);
						posting.setCreditAccount(faAccount1);
						posting.setDebitAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
						posting.setCreditAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
					}

				}

				if (item.getAssetType().equalsIgnoreCase("FF")) {
					if (item.getBookAmt().longValueExact() < 0) {
						posting.setDebitAccount(disposalAccount1);
						posting.setCreditAccount(ffAccount1);
						posting.setDebitAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
						posting.setCreditAmt(new BigDecimal(item.getTnxAmount().longValueExact() * -1));
					}
				}
			}

			return posting;
		};
	}

	@Bean
	public JpaItemWriter<FixedAsset> depProcessWriter() {
		JpaItemWriter<FixedAsset> jpaItemWriter = new JpaItemWriter<>();
		jpaItemWriter.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		return jpaItemWriter;
	}

	@Bean
	public ItemReader<FixedAsset> depProcessReader() throws Exception {
		JpaPagingItemReader<FixedAsset> reader = new JpaPagingItemReader<FixedAsset>();
		reader.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		reader.setQueryString("select u from FixedAsset u where u.productCode = 'FA' and u.needDepreciate = true");
		reader.afterPropertiesSet();
		reader.setSaveState(true);
		return reader;
	}

	@Bean
	public ItemProcessor<FixedAsset, FixedAsset> depProcessprocessor() {
		return (item) -> {
			SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM-yyyy");
			String date = DATE_FORMAT.format(new Date());
			String depDate = DATE_FORMAT.format(item.getNextCollectionDate());
			Calendar myCal = Calendar.getInstance();
			myCal.setTime(item.getNextCollectionDate());
			if (date.equalsIgnoreCase(depDate)) {
				int freq = 0;
				int freqMonth = 0;
				DepreciationProcessTxn txn = new DepreciationProcessTxn();
				txn.setEntity(item.getEntity());
				txn.setProdCode("DE");
				txn.setProdRefId(item.getProdRefId());
				txn.setAssetType(item.getAssetType());
				txn.setAssetSubType(item.getAssetSubType());
				txn.setDepreciationMethod(item.getDepMethod());
				txn.setDepreciationRate(item.getDepRate());
				txn.setDepreciationCollFreq(item.getDepCollFrequency());
				txn.setResidualCcy(item.getResidualCurrency());
				txn.setResidualValue(item.getResidualValue());
				txn.setAccmDepreciationCcy(item.getAccumDepCurrency());
				if (item.getDepCollFrequency().equalsIgnoreCase("M")) {
					freq = 12;
					freqMonth = 1;
				} else if (item.getDepCollFrequency().equalsIgnoreCase("Q")) {
					freq = 4;
					freqMonth = 3;
				} else if (item.getDepCollFrequency().equalsIgnoreCase("H")) {
					freq = 2;
					freqMonth = 6;
				} else if (item.getDepCollFrequency().equalsIgnoreCase("Y")) {
					freq = 1;
					freqMonth = 12;
				}
				txn.setBusinessDate(new Date());
				txn.setBookCcy(item.getBookCurrency());
				txn.setBookAmt(item.getBookAmt());
				txn.setDepSeq(item.getDepSequence() + 1);
				txn.setTnxId(CustomIdGeneration.generateTxnId(new Date()));
				txn.setTnxType("90");
				txn.setTnxSubType("92");
				myCal.add(Calendar.MONTH, freqMonth);
				txn.setCollectedToDate(myCal.getTime());
				DepreciationProcessMst mst = depMstRepo.findByProdRefId(txn.getProdRefId());
				DepreciationProcessMst depMst = new DepreciationProcessMst(txn);
				txn.setDepreciationCcy(item.getTnxCurrency());
				txn.setAccmDepreciationCcy(item.getAccumDepCurrency());
				if (mst != null) {
					depMst.setId(mst.getId());
					if (!mst.getBookAmt().equals(item.getBookAmt())
							|| !mst.getResidualValue().equals(item.getResidualValue())) {
						BigDecimal current = new BigDecimal(
								(((item.getBookAmt().longValueExact() - item.getResidualValue().longValueExact())
										* item.getDepRate().longValueExact()) / freq));
						BigDecimal previous = new BigDecimal(
								(((depMst.getBookAmt().longValueExact() - depMst.getResidualValue().longValueExact())
										* item.getDepRate().longValueExact()) / freq) * depMst.getDepSeq());
						BigDecimal currentFreq = new BigDecimal(
								(((item.getBookAmt().longValueExact() - item.getResidualValue().longValueExact())
										* item.getDepRate().longValueExact()) / freq) * depMst.getDepSeq());
						txn.setAccmDepreciationAmt(new BigDecimal(current.longValueExact() - previous.longValueExact()
								- currentFreq.longValueExact() + item.getAccumDepAmt().longValueExact()));
						txn.setAccmDepreciationAmt(new BigDecimal(
								current.longValueExact() - previous.longValueExact() - currentFreq.longValueExact()));
					} else {
						txn.setAccmDepreciationAmt(new BigDecimal(item.getAccumDepAmt().longValueExact()
								+ ((item.getBookAmt().longValueExact() - item.getResidualValue().longValueExact())
										* item.getDepRate().longValueExact()) / freq));
						txn.setDepreciationAmt(new BigDecimal(
								((item.getBookAmt().longValueExact() - item.getResidualValue().longValueExact())
										* item.getDepRate().longValueExact()) / freq));
					}
				} else {
					txn.setAccmDepreciationAmt(new BigDecimal(item.getAccumDepAmt().longValueExact()
							+ ((item.getBookAmt().longValueExact() - item.getResidualValue().longValueExact())
									* item.getDepRate().longValueExact()) / freq));
					txn.setDepreciationAmt(new BigDecimal(
							((item.getBookAmt().longValueExact() - item.getResidualValue().longValueExact())
									* item.getDepRate().longValueExact()) / freq));

				}
				depTxnRepo.save(txn);
				depMst.setAccmDepreciationAmt(txn.getAccmDepreciationAmt());
				depMst.setAccmDepreciationCcy(txn.getAccmDepreciationCcy());
				depMstRepo.save(depMst);
				item.setNextCollectionDate(myCal.getTime());
				item.setAccumDepCurrency(txn.getAccmDepreciationCcy());
				item.setAccumDepAmt(txn.getAccmDepreciationAmt());
				item.setNetAssetCurrency(txn.getBookCcy());
				item.setNetAssetAmount(new BigDecimal(
						txn.getBookAmt().longValueExact() - txn.getAccmDepreciationAmt().longValueExact()));
				item.setDepSequence(txn.getDepSeq());
				if (item.getResidualValue() == txn.getDepreciationAmt()) {
					item.setNeedDepreciate(false);
				}
			}
			return item;
		};
	}

	/*
	 * Type : Transacation Manager Purpose : Only for batch transaction handling
	 */

	@Bean
	@Qualifier("jpaTrx")
	public PlatformTransactionManager jpaTransactionManager() {
		return new JpaTransactionManager(entityManager.getEntityManagerFactory());
	}

	@Bean
	public Step faPostingStep() throws Exception {
		return stepBuilderFactory.get("step1").transactionManager(jpaTransactionManager())
				.<FixedAsset, PostingTxn>chunk(10).reader(reader()).processor(processor())
				.writer(writer()/* new CustomItemWriter() */).build();
	}

	@Bean
	public Step faPostingReportStep() throws Exception {
		return stepBuilderFactory.get("fa-report-step").<PostingTxn, PostingTxn>chunk(10000).reader(simpleReader())
				.writer(new CustomItemWriter(fileDir)).build();
	}

	@Bean
	public Step depPostingReportStep() throws Exception {
		return stepBuilderFactory.get("dep-report-step").<DepPostingTxn, DepPostingTxn>chunk(10000)
				.reader(depSimpleReader()).writer(new DepItemWriter(fileDir)).build();
	}

	@Bean
	public Job faPosting() throws Exception {
		return jobBuilderFactory.get("JOB1").incrementer(new RunIdIncrementer()).flow(faPostingStep()).end().build();
	}

	@Bean
	public Step depProcessStep() throws Exception {
		return stepBuilderFactory.get("step2").transactionManager(jpaTransactionManager())
				.<FixedAsset, FixedAsset>chunk(10).reader(depProcessReader()).processor(depProcessprocessor())
				.writer(depProcessWriter()).build();
	}

	/*@Bean
	public Job depProcess() throws Exception {
		return jobBuilderFactory.get("JOB2").incrementer(new RunIdIncrementer()).flow(depProcessStep()).next(depPostingStep()).next(depPostingReportStep()).next(faPostingReportStep()).end().build();
	}*/

	@Bean
	public Job notificationJob() throws Exception {
		return jobBuilderFactory.get("NOTIFICATIONOFF").incrementer(new RunIdIncrementer()).flow(notificationStep())
				.end().build();
	}

	@Bean
	public Step depPostingStep() throws Exception {
		return stepBuilderFactory.get("depPostingStep").transactionManager(jpaTransactionManager())
				.<DepreciationProcessTxn, DepPostingTxn>chunk(10).reader(depPostingReader())
				.processor(depPostingprocessor()).writer(depPostingWriter()).build();
	}

	@Bean
	public Job depPosting() throws Exception {
		return jobBuilderFactory.get("DEP_POSTING").incrementer(new RunIdIncrementer()).flow(depPostingStep()).next(depProcessStep()).next(depPostingReportStep()).next(faPostingReportStep()).end()
				.build();
	}

	@Bean
	public JpaItemWriter<DepPostingTxn> depPostingWriter() {
		JpaItemWriter<DepPostingTxn> jpaItemWriter = new JpaItemWriter<>();
		jpaItemWriter.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		return jpaItemWriter;
	}

	@Bean
	public ItemReader<DepreciationProcessTxn> depPostingReader() throws Exception {
		JpaPagingItemReader<DepreciationProcessTxn> reader = new JpaPagingItemReader<DepreciationProcessTxn>();
		reader.setEntityManagerFactory(entityManager.getEntityManagerFactory());
		reader.setQueryString("select u from DepreciationProcessTxn u where u.prodCode = 'DE'");
		reader.afterPropertiesSet();
		reader.setSaveState(true);
		return reader;
	}

	@Bean
	public ItemProcessor<DepreciationProcessTxn, DepPostingTxn> depPostingprocessor() {
		return (item) -> {
			SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM-yyyy");
			String date = DATE_FORMAT.format(new Date());
			String depDate = DATE_FORMAT.format(item.getBusinessDate());
			if (date.equalsIgnoreCase(depDate)) {
				DepPostingTxn posting = new DepPostingTxn();
				posting.setTnxType("Posting");
				posting.setTnxSubType("Depreciation");
				posting.setProdRefId(item.getProdRefId());
				posting.setEntity(item.getEntity());
				posting.setProdCode(item.getProdCode());
				posting.setTnxId(item.getTnxId());
				posting.setDebitCcy(item.getBookCcy());
				posting.setCreditCcy(item.getBookCcy());
				posting.setBusinessDate(new Date().toString());
				posting.setRefOne(item.getProdRefId());
				posting.setRefTwo(item.getAssetType());
				if (item.getDepreciationAmt().longValueExact() > 0) {
					if (item.getAssetType().equalsIgnoreCase("VH")) {
						posting.setDebitAccount(depAccount1);
						posting.setCreditAccount(depAccount2);
					} else if (item.getAssetType().equalsIgnoreCase("FF")) {
						posting.setDebitAccount(depAccount3);
						posting.setCreditAccount(depAccount4);

					}
					posting.setDebitAmt(new BigDecimal(item.getDepreciationAmt().longValueExact()));
					posting.setCreditAmt(new BigDecimal(item.getDepreciationAmt().longValueExact()));
				} else {
					if (item.getAssetType().equalsIgnoreCase("VH")) {
						posting.setDebitAccount(depAccount2);
						posting.setCreditAccount(depAccount1);
					} else if (item.getAssetType().equalsIgnoreCase("FF")) {
						posting.setDebitAccount(depAccount4);
						posting.setCreditAccount(depAccount3);
					}
					posting.setDebitAmt(new BigDecimal(item.getDepreciationAmt().longValueExact() * -1));
					posting.setCreditAmt(new BigDecimal(item.getDepreciationAmt().longValueExact() * -1));
				}
				return posting;
			} else {
				return null;
			}

		};
	}

	@Bean
	public Step notificationStep() throws Exception {
		return stepBuilderFactory.get("notificationoff").transactionManager(jpaTransactionManager())
				.<User, User>chunk(10).reader(notiUser()).writer(new ItemWriter<User>() {
					@Override
					public void write(List<? extends User> items) throws Exception {
						Notifications n = new Notifications();
						n.setMessage("System will run batch in next one hour!!!");
						for (User user : items) {
							template.convertAndSendToUser(user.getUsername(), "/queue/notification/", n);
						}
					}
				}).build();
	}

	private boolean isLastDayOfMonth(Date date) {
		SimpleDateFormat DATE_FORMAT1 = new SimpleDateFormat("yyyy-MM-dd");
		String currentDate = DATE_FORMAT1.format(new Date());

		SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM");
		String newDate = DATE_FORMAT.format(new Date());
		List<String> businessDateList = holidayService.findByYear();
		List<String> monthDateList = new ArrayList<>();
		for (String s : businessDateList) {
			if (s.contains(newDate)) {
				monthDateList.add(s);
			}
		}
		String lastWorkingDay = monthDateList.get(monthDateList.size() - 1);
		if (lastWorkingDay.equalsIgnoreCase(currentDate)) {
			return true;
		} else {
			return false;
		}
	}

}
