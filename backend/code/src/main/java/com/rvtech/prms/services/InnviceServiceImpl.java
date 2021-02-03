package com.rvtech.prms.services;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import com.rvtech.prms.common.ClientBillingDto;
import com.rvtech.prms.common.DBClientDataDto;
import com.rvtech.prms.common.FilterDto;
import com.rvtech.prms.common.FixedRateInvoiceDetailDto;
import com.rvtech.prms.common.InnvoiceDto;
import com.rvtech.prms.common.InvoiceDetailDto;
import com.rvtech.prms.common.InvoiceGenDto;
import com.rvtech.prms.common.InvoicePDFDto;
import com.rvtech.prms.common.MileStoneDto;
import com.rvtech.prms.constant.Constants;
import com.rvtech.prms.entity.AddressDetailsEntity;
import com.rvtech.prms.entity.AttendanceEntity;
import com.rvtech.prms.entity.BillingTypeDetailsEntity;
import com.rvtech.prms.entity.ClientBillingInvoiceDetailEntity;
import com.rvtech.prms.entity.ClientDetailsEntity;
import com.rvtech.prms.entity.FixedRateInvoiceDetailEntity;
import com.rvtech.prms.entity.InvoiceDetailEntity;
import com.rvtech.prms.entity.InvoiceEntity;
import com.rvtech.prms.entity.InvoicePDFEntity;
import com.rvtech.prms.entity.MileStoneEntity;
import com.rvtech.prms.entity.ProjectEmployeMappingEntity;
import com.rvtech.prms.entity.ProjectEntity;
import com.rvtech.prms.entity.PurchaseOrderEntity;
import com.rvtech.prms.repository.AddressRepository;
import com.rvtech.prms.repository.AttendanceRepository;
import com.rvtech.prms.repository.BillingTypeDetailRepository;
import com.rvtech.prms.repository.ClientBillingRepository;
import com.rvtech.prms.repository.ClientDetailRepository;
import com.rvtech.prms.repository.ExpenceRepository;
import com.rvtech.prms.repository.FixedRateInvoiceDetailRepository;
import com.rvtech.prms.repository.InvoiceDetailRepository;
import com.rvtech.prms.repository.InvoicePDFRepository;
import com.rvtech.prms.repository.MileStoneRepository;
import com.rvtech.prms.repository.ProjectEmployeMappingRepository;
import com.rvtech.prms.repository.ProjectRepository;
import com.rvtech.prms.repository.PurchaseOrderRepository;
import com.rvtech.prms.repository.RateCardRepository;
import com.rvtech.prms.util.GenericMapper;
import com.rvtech.prms.util.Utilities;

@Transactional
@Service
public class InnviceServiceImpl {

	private static final Logger logger = LoggerFactory.getLogger(InnviceServiceImpl.class);

	static ModelMapper modelMapper = new ModelMapper();

	private MultiValueMap<String, String> headers = null;

	private Map<String, Object> responceMap;

	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private ClientDetailRepository clientDetailRepository;

	@Autowired
	private PurchaseOrderRepository purchaseOrderRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private ProjectEmployeMappingRepository projectEmployeMappingRepository;

	@Autowired
	private FixedRateInvoiceDetailRepository fixedRateInvoiceDetailRepository;

	@Autowired
	private ClientBillingRepository clientBillingRepository;

	@Autowired
	private InvoicePDFRepository invoicePDFRepository;

	@Autowired
	private RateCardRepository rateCardRepository;

	private List<ProjectEmployeMappingEntity> projEmplList;

	private List<ProjectEntity> projList;

	SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

	SimpleDateFormat dateFormatAtt = new SimpleDateFormat("yyyy-MM-dd");

	@Autowired
	private BillingTypeDetailRepository billingTypeDetailRepository;
	@Autowired
	private InvoiceDetailRepository invoiceDetailRepository;

	@Autowired
	private MileStoneRepository mileStoneRepository;

	@Autowired
	private ProjectRepository projectRepository;

	private List<InvoiceDetailEntity> invoiceDetailEntities;

	private List<InvoiceDetailDto> invoiceDetailDtos;

	private List<MileStoneDto> mileStoneDtos;

	private InvoiceDetailEntity invoiceDetailEntity;

	private Map<Integer, Float> daypermon;

	private Calendar calendar = Calendar.getInstance();

	private SecureRandom rand;

	private String[] dayCalculation;

	private Map<String, List<String>> daymap;

	private Map<String, Integer> formulaMap;

	private String detailFormula = null;

	private Map<String, Float> attMapForFormula;

	public ResponseEntity<?> projectWiseBill(FilterDto filterDto) {
		DBClientDataDto dBClientDataDto = new DBClientDataDto();
		/*
		 * List<Map<String, String>> clientId = new ArrayList<Map<String, String>>();
		 * List<Map<String, Float>> clientData = new ArrayList<Map<String, Float>>();
		 * Map<String, Float> projectWiseBill; daypermon = new HashMap<Integer,
		 * Float>(); InvoiceEntity innvoiseEntity = null; Date onboardingDate; Date
		 * exitDate; Float projectCost = (float) 0; Float rateCost = null; float innCost
		 * = 0; int dayPresent = 0; int halfDay = 0; // int toMon =
		 * calendar.get(Calendar.MONTH) + 1; // monDiff = toMon - startMon;
		 * 
		 * ProjectEmployeMappingEntity projectEmployeMappingEntity = null; responceMap =
		 * new HashMap<String, Object>(); headers = Utilities.getDefaultHeader();
		 * 
		 * try { projList = new ArrayList<ProjectEntity>(); projList =
		 * projectRepository.findAllByActive(true); for (ProjectEntity obj : projList) {
		 * Map<String, String> map = new HashMap<String, String>(); map.put("name",
		 * (String) obj.getProjectName()); map.put("value", (String) obj.getId());
		 * clientId.add(map); } dBClientDataDto.setClientId(clientId);
		 * 
		 * } catch (Exception e) {
		 * logger.error("InnviceServiceImpl::create::Fetching employeeList on projectId"
		 * + e.getMessage()); }
		 * 
		 * if (projList != null && !projList.isEmpty()) {
		 * 
		 * invoiceDetailEntities = new ArrayList<InvoiceDetailEntity>(); for
		 * (ProjectEntity projecEntity : projList) { innCost = 0; projectWiseBill = new
		 * HashMap<String, Float>(); try { projectWiseBill.put(projecEntity.getId(),
		 * (float) 0); projEmplList = new ArrayList<ProjectEmployeMappingEntity>();
		 * projEmplList =
		 * projectEmployeMappingRepository.findAllByProjectId(projecEntity.getId()); //
		 * Calculating per day rate of employee based on information for
		 * (ProjectEmployeMappingEntity projecEmplMapping : projEmplList) { dayPresent =
		 * 0; halfDay = 0; List<String> rateObj =
		 * rateCardRepository.findRateById(projecEmplMapping.getRateCardId()); String
		 * rate = rateObj.get(0);
		 * 
		 * if (String.valueOf(rate).split(",")[2].equals("Daily")) { rateCost =
		 * Float.valueOf(String.valueOf(rate).split(",")[0]); } else if
		 * (rateObj.equals("Hourly")) { rateCost =
		 * Float.valueOf(String.valueOf(rate).split(",")[0])
		 * Float.valueOf(String.valueOf(rate).split(",")[1]); } else { rateCost =
		 * Float.valueOf(String.valueOf(rate).split(",")[0]) /
		 * Float.valueOf(String.valueOf(rate).split(",")[1]); }
		 * 
		 * onboardingDate = projecEmplMapping.getOnbordaingDate(); exitDate =
		 * projecEmplMapping.getExitDate() == null ? new Date() :
		 * projecEmplMapping.getExitDate(); List<AttendanceEntity> attendanceEntities =
		 * attendanceRepository.findattendance( projecEmplMapping.getAccountId(),
		 * dateFormatAtt.format(onboardingDate), dateFormatAtt.format(exitDate));
		 * 
		 * for (AttendanceEntity attendanceEntity : attendanceEntities) { String[]
		 * splitPresentDayAray = attendanceEntity.getDayPresent().split(","); for (int i
		 * = 1; i < splitPresentDayAray.length; i++) { if (splitPresentDayAray[i] !=
		 * null && !splitPresentDayAray[i].equals(" ") &&
		 * dateFormat.parse(splitPresentDayAray[i]).getTime() >= onboardingDate
		 * .getTime() && dateFormat.parse(splitPresentDayAray[i]).getTime() <=
		 * exitDate.getTime()) { dayPresent++; } } innCost = (dayPresent * rateCost) +
		 * innCost; String[] splitHalfDayAray =
		 * attendanceEntity.getHalfDay().split(","); for (int i = 1; i <
		 * splitHalfDayAray.length; i++) { if (splitHalfDayAray[i] != null &&
		 * !splitHalfDayAray[i].equals(" ") &&
		 * dateFormat.parse(splitPresentDayAray[i]).getTime() >= onboardingDate
		 * .getTime() && dateFormat.parse(splitPresentDayAray[i]).getTime() <=
		 * exitDate.getTime()) { halfDay++;
		 * calendar.setTime(dateFormat.parse(splitPresentDayAray[i]));
		 * daypermon.put(calendar.get(Calendar.MONTH) + 1,
		 * (daypermon.get(calendar.get(Calendar.MONTH) + 1) + (float) 0.5)); } } innCost
		 * = (((halfDay / 2) + (halfDay % 2)) * rateCost) + innCost;
		 * 
		 * } }
		 * 
		 * } catch (Exception exception) { logger.error("projectWiseBill" +
		 * exception.getMessage()); } projectWiseBill.put(projecEntity.getId(),
		 * innCost); clientData.add(projectWiseBill); }
		 * dBClientDataDto.setClientData(clientData);
		 * 
		 * }
		 * 
		 * try { } catch (Exception e) { logger.error("ExpenceServiceImpl::create::" +
		 * e.getMessage()); headers.add(Constants.STATUS,
		 * HttpStatus.INTERNAL_SERVER_ERROR.toString()); headers.add(Constants.MESSAGE,
		 * "Something went wrong"); responceMap.put("Status",
		 * HttpStatus.INTERNAL_SERVER_ERROR); }
		 */
		return new ResponseEntity<>(dBClientDataDto, headers, HttpStatus.OK);
	}

	public ResponseEntity<?> clientWiseBill(FilterDto filterDto) {
		DBClientDataDto dBClientDataDto = new DBClientDataDto();
		/*
		 * List<Map<String, String>> clientId = new ArrayList<Map<String, String>>();
		 * List<Map<String, Float>> clientData = new ArrayList<Map<String, Float>>();
		 * Map<String, Float> projectWiseBill = null; List<ClientDetailsEntity>
		 * clientList; daypermon = new HashMap<Integer, Float>(); InvoiceEntity
		 * innvoiseEntity = null; Date onboardingDate; Date exitDate; Float projectCost
		 * = (float) 0; Float rateCost = null; float innCost = 0; int dayPresent = 0;
		 * int halfDay = 0; List<Object[]> clientObject = null;
		 * ProjectEmployeMappingEntity projectEmployeMappingEntity = null; responceMap =
		 * new HashMap<String, Object>(); headers = Utilities.getDefaultHeader();
		 * 
		 * try { clientList = new ArrayList<ClientDetailsEntity>(); clientObject =
		 * clientDetailRepository.allclient(); for (Object[] obj : clientObject) {
		 * Map<String, String> map = new HashMap<String, String>(); map.put("name",
		 * (String) obj[0]); map.put("value", (String) obj[1]); clientId.add(map); }
		 * dBClientDataDto.setClientId(clientId);
		 * 
		 * } catch (Exception e) {
		 * logger.error("InnviceServiceImpl::create::Fetching employeeList on projectId"
		 * + e.getMessage()); } if (clientObject != null && !clientObject.isEmpty()) {
		 * for (Object[] obj : clientObject) { projectWiseBill = new HashMap<String,
		 * Float>();
		 * 
		 * projList = new ArrayList<ProjectEntity>(); projList =
		 * projectRepository.findByClientId((String) obj[1]); innCost = 0;
		 * 
		 * for (ProjectEntity projecEntity : projList) { try { //
		 * projectWiseBill.put(projecEntity.getId(), (float) 0); projEmplList = new
		 * ArrayList<ProjectEmployeMappingEntity>(); projEmplList =
		 * projectEmployeMappingRepository.findAllByProjectId(projecEntity.getId()); //
		 * Calculating per day rate of employee based on information for
		 * (ProjectEmployeMappingEntity projecEmplMapping : projEmplList) { dayPresent =
		 * 0; halfDay = 0; List<String> rateObj =
		 * rateCardRepository.findRateById(projecEmplMapping.getRateCardId()); String
		 * rate = rateObj.get(0);
		 * 
		 * if (String.valueOf(rate).split(",")[2].equals("Daily")) { rateCost =
		 * Float.valueOf(String.valueOf(rate).split(",")[0]); } else if
		 * (rateObj.equals("Hourly")) { rateCost =
		 * Float.valueOf(String.valueOf(rate).split(",")[0])
		 * Float.valueOf(String.valueOf(rate).split(",")[1]); } else { rateCost =
		 * Float.valueOf(String.valueOf(rate).split(",")[0]) /
		 * Float.valueOf(String.valueOf(rate).split(",")[1]); }
		 * 
		 * onboardingDate = projecEmplMapping.getOnbordaingDate(); exitDate =
		 * projecEmplMapping.getExitDate() == null ? new Date() :
		 * projecEmplMapping.getExitDate(); List<AttendanceEntity> attendanceEntities =
		 * attendanceRepository.findattendance( projecEmplMapping.getAccountId(),
		 * dateFormatAtt.format(onboardingDate), dateFormatAtt.format(exitDate));
		 * 
		 * for (AttendanceEntity attendanceEntity : attendanceEntities) { String[]
		 * splitPresentDayAray = attendanceEntity.getDayPresent().split(","); for (int i
		 * = 1; i < splitPresentDayAray.length; i++) { if (splitPresentDayAray[i] !=
		 * null && !splitPresentDayAray[i].equals(" ") &&
		 * dateFormat.parse(splitPresentDayAray[i]).getTime() >= onboardingDate
		 * .getTime() && dateFormat.parse(splitPresentDayAray[i]).getTime() <= exitDate
		 * .getTime()) { dayPresent++; } } innCost = (dayPresent * rateCost) + innCost;
		 * String[] splitHalfDayAray = attendanceEntity.getHalfDay().split(","); for
		 * (int i = 1; i < splitHalfDayAray.length; i++) { if (splitHalfDayAray[i] !=
		 * null && !splitHalfDayAray[i].equals(" ") &&
		 * dateFormat.parse(splitPresentDayAray[i]).getTime() >= onboardingDate
		 * .getTime() && dateFormat.parse(splitPresentDayAray[i]).getTime() <= exitDate
		 * .getTime()) { halfDay++;
		 * calendar.setTime(dateFormat.parse(splitPresentDayAray[i]));
		 * daypermon.put(calendar.get(Calendar.MONTH) + 1,
		 * (daypermon.get(calendar.get(Calendar.MONTH) + 1) + (float) 0.5)); } } innCost
		 * = (((halfDay / 2) + (halfDay % 2)) * rateCost) + innCost;
		 * 
		 * } }
		 * 
		 * } catch (Exception exception) { logger.error("projectWiseBill" +
		 * exception.getMessage()); }
		 * 
		 * } projectWiseBill.put((String) obj[1], innCost);
		 * clientData.add(projectWiseBill); } dBClientDataDto.setClientData(clientData);
		 * 
		 * }
		 * 
		 * try { } catch (Exception e) { logger.error("ExpenceServiceImpl::create::" +
		 * e.getMessage()); headers.add(Constants.STATUS,
		 * HttpStatus.INTERNAL_SERVER_ERROR.toString()); headers.add(Constants.MESSAGE,
		 * "Something went wrong"); responceMap.put("Status",
		 * HttpStatus.INTERNAL_SERVER_ERROR); }
		 * 
		 */ return new ResponseEntity<>(dBClientDataDto, headers, HttpStatus.OK);
	}

	public ResponseEntity<?> create(InnvoiceDto innvoiceDto) {
		ProjectEntity projectEntity = projectRepository.findById(innvoiceDto.getProjectId()).get();
		if (projectEntity.getProjectBillingType().equalsIgnoreCase("Payable Days")) {
			return payableDaysCal(innvoiceDto);
		} else if (projectEntity.getProjectBillingType().equalsIgnoreCase("Mile Stone")) {
			return mileStoneCal(innvoiceDto);
		} else {
			return fixRateCal(innvoiceDto);
		}

	}

	public ResponseEntity<?> fixRateCal(InnvoiceDto innvoiceDto) {

		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		List<FixedRateInvoiceDetailDto> fixedRateInvoiceDetailDtos = new ArrayList<FixedRateInvoiceDetailDto>();
		Calendar startCalendar = Calendar.getInstance();
		startCalendar.setTime(innvoiceDto.getFromDate());
		startCalendar.set(Calendar.HOUR, 0);
		startCalendar.set(Calendar.MINUTE, 0);
		startCalendar.set(Calendar.SECOND, 0);
		startCalendar.set(Calendar.MILLISECOND, 0);

		// int startDate = startCalendar.get(Calendar.DATE);
		int startMon = startCalendar.get(Calendar.MONTH) + 1;
		int startYear = startCalendar.get(Calendar.YEAR);
		// long startDateInMill = startCalendar.getTimeInMillis();

		List<Date> dateList = billingTypeDetailRepository.startDateByProjectId(innvoiceDto.getProjectId());
		Calendar dateCal = Calendar.getInstance();
		dateCal.setTime(dateList.get(0));

		if (dateCal.getTimeInMillis() > startCalendar.getTimeInMillis()) {
			startCalendar.setTimeInMillis(dateCal.getTimeInMillis());
			startMon = startCalendar.get(Calendar.MONTH) + 1;
			startYear = startCalendar.get(Calendar.YEAR);

		}
		dateCal.set(Calendar.MONTH, startMon - 1);
		dateCal.set(Calendar.YEAR, startYear);
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(innvoiceDto.getToDate());
		endCalendar.set(Calendar.HOUR, 0);
		endCalendar.set(Calendar.MINUTE, 0);
		endCalendar.set(Calendar.SECOND, 0);
		endCalendar.set(Calendar.MILLISECOND, 0);

		// int endDate = endCalendar.get(Calendar.DATE);
		int endMon = endCalendar.get(Calendar.MONTH) + 1;
		int endYear = endCalendar.get(Calendar.YEAR);
		// long endDateInMill = endCalendar.getTimeInMillis();

		SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd");

		for (int i = 0; i <= ((endYear - startYear) * 12 + endMon - startMon); i++) {
			if (dateCal.getTimeInMillis() >= startCalendar.getTimeInMillis()
					&& dateCal.getTimeInMillis() < endCalendar.getTimeInMillis()) {
				FixedRateInvoiceDetailDto fixedRateInvoiceDetailDto = new FixedRateInvoiceDetailDto();
				fixedRateInvoiceDetailDto.setStartDate(dateCal.getTime());
				// dateCal.set(Calendar.DATE, dateCal.get(Calendar.DATE) - 1);
				dateCal.set(Calendar.MONTH, dateCal.get(Calendar.MONTH) + 1);
				if (dateCal.getTimeInMillis() <= Calendar.getInstance().getTimeInMillis()) {
					Calendar endDateCal = Calendar.getInstance(); // this would default to now
					endDateCal.setTimeInMillis(dateCal.getTimeInMillis());
					endDateCal.add(Calendar.DAY_OF_MONTH, -1);
					fixedRateInvoiceDetailDto.setEndDate(endDateCal.getTime());

					List<FixedRateInvoiceDetailEntity> fixedRateInvoiceDetailEntities = fixedRateInvoiceDetailRepository
							.findByStartDateContainingAndProjectIdContainingAndActive(
									dateFormater.format(fixedRateInvoiceDetailDto.getStartDate()),
									innvoiceDto.getProjectId());
					if (fixedRateInvoiceDetailEntities == null || fixedRateInvoiceDetailEntities.size() == 0)
						fixedRateInvoiceDetailDtos.add(fixedRateInvoiceDetailDto);
				}
				// dateCal.set(Calendar.DATE, dateCal.get(Calendar.DATE) + 1);

			}
		}

		if (fixedRateInvoiceDetailDtos != null && fixedRateInvoiceDetailDtos.size() > 0) {
			for (FixedRateInvoiceDetailDto fixedRateInvoiceDetailDto : fixedRateInvoiceDetailDtos) {
				float amount = billingTypeDetailRepository
						.selectAmoFromStartDate(dateFormater.format(fixedRateInvoiceDetailDto.getStartDate()));
				fixedRateInvoiceDetailDto.setAmount(amount);
			}

			headers.add(Constants.STATUS, HttpStatus.OK.toString());
			headers.add(Constants.MESSAGE, "Fixed pay  list fetched  successfully");
			return new ResponseEntity<>(fixedRateInvoiceDetailDtos, headers, HttpStatus.OK);
		} else {
			headers.add(Constants.STATUS, HttpStatus.NO_CONTENT.toString());
			headers.add(Constants.MESSAGE, "No list present");
			responceMap.put("Status", HttpStatus.NO_CONTENT);
			responceMap.put(Constants.MESSAGE, "No list present");

		}
		return new ResponseEntity<>(responceMap, headers, HttpStatus.OK);
	}

	public ResponseEntity<?> mileStoneCal(InnvoiceDto innvoiceDto) {

		mileStoneDtos = new ArrayList<MileStoneDto>();
		daypermon = new HashMap<Integer, Float>();
		SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
		List<MileStoneEntity> entitiesList = mileStoneRepository.findByDate(innvoiceDto.getProjectId(),
				date.format(innvoiceDto.getFromDate()), date.format(innvoiceDto.getToDate()));
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		if (entitiesList != null && entitiesList.size() > 0) {
			headers.add(Constants.STATUS, HttpStatus.OK.toString());
			headers.add(Constants.MESSAGE, "Milstone list fetched  successfully");
			Iterable<MileStoneEntity> iterable = entitiesList;
			List<MileStoneDto> dtos = GenericMapper.mapper.mapAsList(iterable, MileStoneDto.class);
			return new ResponseEntity<>(dtos, headers, HttpStatus.OK);
		} else {
			headers.add(Constants.STATUS, HttpStatus.NO_CONTENT.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.NO_CONTENT);
			responceMap.put(Constants.MESSAGE, "No list present");

		}
		return new ResponseEntity<>(responceMap, headers, HttpStatus.OK);

	}

	public ResponseEntity<?> payableDaysCal(InnvoiceDto innvoiceDto) {

		Pageable page = PageRequest.of(0, 10);
		BillingTypeDetailsEntity billingTypeDetailsEntity = billingTypeDetailRepository
				.findByProjectIdContainingAndActive(innvoiceDto.getProjectId(), true, page).get(0);
		String formula = billingTypeDetailsEntity.getFormula();
		formulaCalculation(formula);
		invoiceDetailDtos = new ArrayList<InvoiceDetailDto>();
		daypermon = new HashMap<Integer, Float>();

		InvoiceEntity innvoiseEntity;

		Float innCost = (float) 0;
		Float rateCost = null;

		calendar.setTime(innvoiceDto.getFromDate());
		calendar.set(Calendar.HOUR, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		int startMon = calendar.get(Calendar.MONTH) + 1;
		Long startTime = calendar.getTimeInMillis();

		calendar.setTime(innvoiceDto.getToDate());
		calendar.set(Calendar.HOUR, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);

		int toMon = calendar.get(Calendar.MONTH) + 1;
		Long endTime = calendar.getTimeInMillis();

		// monDiff = toMon - startMon;

		ProjectEmployeMappingEntity projectEmployeMappingEntity = null;
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();

		// this area finding employee by project id
		try {
			projEmplList = new ArrayList<ProjectEmployeMappingEntity>();
			projEmplList = projectEmployeMappingRepository.findAllByProjectIdAndActiveTrue(innvoiceDto.getProjectId());
		} catch (Exception e) {
			logger.error("InnviceServiceImpl::create::Fetching employeeList on projectId" + e.getMessage());
		}

		// start the calculation invoice details
		try {

			invoiceDetailEntities = new ArrayList<InvoiceDetailEntity>();

			for (ProjectEmployeMappingEntity employeMappingEntity : projEmplList) {
				Date onboardingDate = employeMappingEntity.getOnbordaingDate() == null ? innvoiceDto.getFromDate()
						: employeMappingEntity.getOnbordaingDate();
				Date exitDate = employeMappingEntity.getExitDate() == null ? innvoiceDto.getToDate()
						: employeMappingEntity.getExitDate();
				innCost = (float) 0;
				for (int i = startMon; i <= toMon; i++) {
					daypermon.put(i, (float) 0);
				}
				invoiceDetailEntity = new InvoiceDetailEntity();
				float dayPresent = 0;
				int halfDay = 0;
				// Calculating per day rate of employee based on information
				List<String> rateObj = rateCardRepository.findRateById(employeMappingEntity.getRateCardId());
				String rate = rateObj.get(0);

				if (String.valueOf(rate).split(",")[2].equals("Daily")) {
					rateCost = Float.valueOf(String.valueOf(rate).split(",")[0]);
				} else if (rateObj.equals("Hourly")) {
					rateCost = Float.valueOf(String.valueOf(rate).split(",")[0])
							* Float.valueOf(String.valueOf(rate).split(",")[1]);
				} else {
					rateCost = Float.valueOf(String.valueOf(rate).split(",")[0])
							/ Float.valueOf(String.valueOf(rate).split(",")[1]);
				}

				List<AttendanceEntity> attendanceEntities = attendanceRepository.findattendance(
						employeMappingEntity.getAccountId(), dateFormatAtt.format(innvoiceDto.getFromDate()),
						dateFormatAtt.format(innvoiceDto.getToDate()));

				// iterating the attendance entity
				for (AttendanceEntity attendanceEntity : attendanceEntities) {
					detailFormula = null;
					int dayValue = 0;
					dayCalculation = attendanceEntity.getDayCalculation().split(",");
					// dayWiseCalculation(dayCalculation);
					// this for loop calculating day present
					for (int i = 0; i < dayCalculation.length; i++) {
						String day = dayCalculation[i].substring(0, dayCalculation[i].indexOf("("));
						String key = dayCalculation[i].substring(dayCalculation[i].indexOf("(") + 1,
								dayCalculation[i].indexOf(")"));
						if (!key.contains("/") && dayCalculation[i] != null && !dayCalculation[i].equals(" ")
								&& dateFormat.parse(day).getTime() >= startTime
								&& dateFormat.parse(day).getTime() <= endTime
								&& dateFormat.parse(day).getTime() >= onboardingDate.getTime()
								&& dateFormat.parse(day).getTime() <= exitDate.getTime()) {
							dayValue = 0;
							dayValue = formulaMap.get(key);
							dayPresent = dayPresent + dayValue;
							calendar.setTime(dateFormat.parse(day));
							daypermon.put(calendar.get(Calendar.MONTH) + 1,
									daypermon.get(calendar.get(Calendar.MONTH) + 1) + dayValue);
							attMapForFormula.put(key, attMapForFormula.get(key) + 1);
						}

						if (key.contains("/") && dayCalculation[i] != null && !dayCalculation[i].equals(" ")
								&& dateFormat.parse(day).getTime() >= startTime
								&& dateFormat.parse(day).getTime() <= endTime
								&& dateFormat.parse(day).getTime() >= onboardingDate.getTime()
								&& dateFormat.parse(day).getTime() <= exitDate.getTime()) {
							dayValue = 0;
							String[] keyArray = key.split("/");
							for (String string : keyArray) {
								if (formulaMap.containsKey(string)) {
									dayValue = formulaMap.get(string);
									dayPresent = (float) (dayPresent + (dayValue * 0.5));
									calendar.setTime(dateFormat.parse(day));
									daypermon.put(calendar.get(Calendar.MONTH) + 1,
											(float) (daypermon.get(calendar.get(Calendar.MONTH) + 1)
													+ (dayValue * 0.5)));
									attMapForFormula.put(string, (float) (attMapForFormula.get(string) + 0.5));

								}
							}
						}
					}

					// this line calculating invoice cost
					innCost = (dayPresent * rateCost);
					for (Map.Entry<String, Integer> entry : formulaMap.entrySet()) {
						detailFormula = detailFormula == null ? " " : detailFormula + "+";
						detailFormula = detailFormula + entry.getKey() + "(" + attMapForFormula.get(entry.getKey())
								+ ")" + "*" + entry.getValue();
						attMapForFormula.put(entry.getKey(), (float) 0.0);
					}

					/*
					 * String[] splitHalfDayAray = attendanceEntity.getHalfDay().split(","); // this
					 * loop calculating half day invoice cost for (int i = 0; i <
					 * splitHalfDayAray.length; i++) { if (splitHalfDayAray[i] != null &&
					 * !splitHalfDayAray[i].equals(" ") &&
					 * dateFormat.parse(splitHalfDayAray[i]).getTime() >= startTime &&
					 * dateFormat.parse(splitHalfDayAray[i]).getTime() <= endTime &&
					 * dateFormat.parse(splitPresentDayAray[i]).getTime() >=
					 * onboardingDate.getTime() &&
					 * dateFormat.parse(splitPresentDayAray[i]).getTime() <= exitDate.getTime()) {
					 * halfDay++; calendar.setTime(dateFormat.parse(splitPresentDayAray[i]));
					 * daypermon.put(calendar.get(Calendar.MONTH) + 1,
					 * (daypermon.get(calendar.get(Calendar.MONTH) + 1) + (float) 0.5)); } } innCost
					 * = (((halfDay / 2) + (halfDay % 2)) * rateCost) + innCost;
					 */
					invoiceDetailEntity.setEmployeeName(attendanceEntity.getEmployeeName());
					invoiceDetailEntity.setEmployeeId(attendanceEntity.getEmployeeId());
					invoiceDetailEntity.setPerDayRate(rateCost);
					invoiceDetailEntity.setAttendancepermonth(daypermon.toString());
					invoiceDetailEntity.setTotalAmt(innCost);
					invoiceDetailEntity.setTotalDays(dayPresent);
					invoiceDetailEntity.setAttDetailFrFormula(detailFormula);
					invoiceDetailEntities.add(invoiceDetailEntity);
				}

			}
			/*
			 * // Adding expence list if (innvoiceDto.getExpList() != null &&
			 * innvoiceDto.getExpList().size() > 0) { for (String expId :
			 * innvoiceDto.getExpList()) { innCost = expenceRepository.findExpById(expId) +
			 * innCost; } } innvoiceDto.setTotalInvAmt(innCost); innvoiseEntity =
			 * innvoiseRepository.save(GenericMapper.mapper.map(innvoiceDto,
			 * InvoiceEntity.class));
			 */
			if (invoiceDetailEntities != null && !invoiceDetailEntities.isEmpty()) {
				// For validataion if invoiceDetailEntities is empty it means attendance is not
				// available for given time , deleting generated invoice too
				/*
				 * if (invoiceDetailEntities != null && invoiceDetailEntities.isEmpty()) {
				 * innvoiseRepository.delete(innvoiseEntity); headers.add(Constants.STATUS,
				 * HttpStatus.NO_CONTENT.toString()); headers.add(Constants.MESSAGE,
				 * "Attendance is not available"); responceMap.put("Status",
				 * HttpStatus.NO_CONTENT); return new ResponseEntity<>(responceMap, headers,
				 * HttpStatus.OK); }
				 */
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "Innvoice generated successfully successfully");
				responceMap.put("Status", HttpStatus.OK);

				for (InvoiceDetailEntity invoiceDetailEntity : invoiceDetailEntities) {
					// invoiceDetailEntity.setInvoiceId(innvoiseEntity.getId());
					// invoiceDetailRepository.save(invoiceDetailEntity);
					invoiceDetailDtos.add(GenericMapper.mapper.map(invoiceDetailEntity, InvoiceDetailDto.class));
				}

				return new ResponseEntity<>(invoiceDetailDtos, headers, HttpStatus.OK);

			} else {
				headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
				headers.add(Constants.MESSAGE, "Something went wrong");
				responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
				responceMap.put(Constants.MESSAGE, "Something went wrong");

			}
		} catch (Exception e) {
			logger.error("ExpenceServiceImpl::create::" + e.getMessage());
			headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
			responceMap.put(Constants.MESSAGE, "Something went wrong");
		}
		return new ResponseEntity<>(responceMap, headers, HttpStatus.OK);

	}

	public void formulaCalculation(String formula) {
		attMapForFormula = new HashMap<String, Float>();
		formulaMap = new HashMap<String, Integer>();
		String[] splitFormula = formula.split(",");
		for (String string : splitFormula) {
			formulaMap.put(string.substring(0, string.indexOf("x")), 1);
			attMapForFormula.put(string.substring(0, string.indexOf("x")), (float) 0);
		}
	}

	public void dayWiseCalculation(String[] dayArray) {
		String type;
		List<String> dayValueList;
		daymap = new HashMap<String, List<String>>();
		for (String eachDay : dayArray) {
			type = null;
			try {
				type = eachDay.substring(eachDay.indexOf("("), eachDay.indexOf(")"));
				if (type != null) {
					if (daymap.containsKey(type)) {
						dayValueList = daymap.get(type);
						dayValueList.add(eachDay.substring(0, eachDay.indexOf("")));
					} else {
						dayValueList = new ArrayList<String>();
						dayValueList.add(eachDay.substring(0, eachDay.indexOf("")));
						daymap.put(type, dayValueList);
					}
				}
			} catch (Exception e) {
				// TODO: handle exception
			}
		}
	}

	public ResponseEntity<?> generatePDF(InvoiceGenDto innvoiceDto) throws NoSuchAlgorithmException {
		if (innvoiceDto.getInvoiceDetailDtos() != null) {
			return generatePDFPayableDays(innvoiceDto);
		} else if (innvoiceDto.getMileStoneDtos() != null) {
			return generatePDFForMileStone(innvoiceDto);
		} else if (innvoiceDto.getFixedRateInvoiceDetailDtos() != null) {
			return generatePDFForFixRate(innvoiceDto);
		} else if (innvoiceDto.getClientBillingDtos() != null) {
			return generatePDFForClientBilling(innvoiceDto);
		}
		return null;

	}

	public ResponseEntity<?> generatePDFForMileStone(InvoiceGenDto innvoiceDto) throws NoSuchAlgorithmException {
		rand = SecureRandom.getInstanceStrong();
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
		Calendar calendar = Calendar.getInstance();
		InvoicePDFDto invoicePDFDto = new InvoicePDFDto();
		// Fetching Project details on projectId
		ProjectEntity projectEntity = projectRepository.findById(innvoiceDto.getProjectId()).get();
		// Fetching client entity and setting related field
		ClientDetailsEntity clientDetailsEntity = clientDetailRepository.findByIdAndActive(projectEntity.getClientId(),
				true);

		int otp = rand.nextInt(1000) + 1000;
		invoicePDFDto.setPaid("DUE");
		invoicePDFDto.setDescription(innvoiceDto.getDescription());
		invoicePDFDto.setBillingType("Mile Stone");

		int nextYear = calendar.get(Calendar.YEAR) + 1;
		invoicePDFDto.setInvoiceDate(dateFormat.format(new Date()));
		invoicePDFDto
				.setInvoiceNo("RV/" + calendar.get(Calendar.YEAR) + "-" + String.valueOf(nextYear).substring(2) + otp);
		invoicePDFDto.setToCompanyName(clientDetailsEntity.getClientName());
		invoicePDFDto.setToGstNo(clientDetailsEntity.getGstNum());
		invoicePDFDto.setToPanNo(clientDetailsEntity.getTanNum());
//If invoiceDueDate is null then adding 30 days to the from date
		if (invoicePDFDto.getInvoiceDueDate() == null) {
			calendar.add(Calendar.DATE, 30);
			invoicePDFDto.setInvoiceDueDate(calendar.getTime());
		}
		// Fetching Client address from address table
		List<AddressDetailsEntity> addressDetailsEntities = addressRepository
				.findByClientId(projectEntity.getClientId());
		invoicePDFDto.setToCompanyAddress(addressDetailsEntities.get(0).getAddressLine() + ","
				+ addressDetailsEntities.get(0).getCity() + "-" + addressDetailsEntities.get(0).getPincode());
		invoicePDFDto.setToCompanyState(addressDetailsEntities.get(0).getState());
		float projectTotalCost = projectEntity.getProjectCost();
		float sum = 0;
		if (innvoiceDto.getMileStoneDtos() != null && !innvoiceDto.getMileStoneDtos().isEmpty()) {
			for (MileStoneDto mileStoneDto : innvoiceDto.getMileStoneDtos()) {
				float mileStoneCost = (float) (projectTotalCost * mileStoneDto.getInvoicePer() * 0.01);
				sum = sum + mileStoneCost;
			}
		}

		// Setting Gst amount if state code is same then cgst and sgst will be calculted
		// or igst will be calculated
		if (invoicePDFDto.getFromGstNo().substring(0, 2).equalsIgnoreCase(invoicePDFDto.getToGstNo().substring(0, 2))) {
			invoicePDFDto.setCGST(sum * 0.09);
			invoicePDFDto.setSGSTUTGS(sum * 0.09);
		} else {
			invoicePDFDto.setIGST(sum * 0.18);
		}
		invoicePDFDto.setBillWitoutGST(sum);
		invoicePDFDto.setBillWitGST((float) (sum + (sum * 0.18)));
		// Creating record of invoice pdf
		InvoicePDFEntity invoicePDFEntity = GenericMapper.mapper.map(invoicePDFDto, InvoicePDFEntity.class);
		invoicePDFEntity.setPoid(projectEntity.getPurchaseOrderId());
		invoicePDFEntity.setClientId(clientDetailsEntity.getId());
		invoicePDFEntity.setFromDate(innvoiceDto.getFromDate());
		invoicePDFEntity.setToDate(innvoiceDto.getToDate());
		invoicePDFEntity.setDescription(innvoiceDto.getDescription());
		invoicePDFEntity = invoicePDFRepository.save(invoicePDFEntity);

		// Updating balence amount in purchase order
		PurchaseOrderEntity purchaseOrderEntity = purchaseOrderRepository
				.findByIdAndActive(projectEntity.getPurchaseOrderId(), true).get();
		purchaseOrderEntity.setInvAmnt(sum);
		purchaseOrderEntity.setBalPoAmt(purchaseOrderEntity.getPoAmount() - sum);
		purchaseOrderRepository.save(purchaseOrderEntity);
		// Storing attendance details in DB
		if (innvoiceDto.getMileStoneDtos() != null && !innvoiceDto.getMileStoneDtos().isEmpty()) {
			for (MileStoneDto mileStoneDto : innvoiceDto.getMileStoneDtos()) {
				MileStoneEntity mileStoneEntity = new MileStoneEntity();
				mileStoneEntity = GenericMapper.mapper.map(mileStoneDto, MileStoneEntity.class);
				mileStoneEntity.setInvoiceId(invoicePDFEntity.getId());
				mileStoneEntity.setProjectId(innvoiceDto.getProjectId());
				mileStoneEntity.setActive(true);
				mileStoneRepository.save(mileStoneEntity);
			}
		}
		return new ResponseEntity<>(invoicePDFDto, headers, HttpStatus.OK);

	}

	public ResponseEntity<?> generatePDFForClientBilling(InvoiceGenDto innvoiceDto) throws NoSuchAlgorithmException {
		rand = SecureRandom.getInstanceStrong();
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
		Calendar calendar = Calendar.getInstance();
		InvoicePDFDto invoicePDFDto = new InvoicePDFDto();
		// Fetching Project details on projectId
		ProjectEntity projectEntity = projectRepository.findById(innvoiceDto.getProjectId()).get();
		// Fetching client entity and setting related field
		ClientDetailsEntity clientDetailsEntity = clientDetailRepository.findByIdAndActive(projectEntity.getClientId(),
				true);

		int otp = rand.nextInt(1000) + 1000;
		invoicePDFDto.setPaid("DUE");
		invoicePDFDto.setDescription(innvoiceDto.getDescription());
		int nextYear = calendar.get(Calendar.YEAR) + 1;
		invoicePDFDto.setInvoiceDate(dateFormat.format(new Date()));
		invoicePDFDto
				.setInvoiceNo("RV/" + calendar.get(Calendar.YEAR) + "-" + String.valueOf(nextYear).substring(2) + otp);
		invoicePDFDto.setToCompanyName(clientDetailsEntity.getClientName());
		invoicePDFDto.setToGstNo(clientDetailsEntity.getGstNum());
		invoicePDFDto.setToPanNo(clientDetailsEntity.getTanNum());
		invoicePDFDto.setBillingType("Client Billing");

//If invoiceDueDate is null then adding 30 days to the from date
		if (invoicePDFDto.getInvoiceDueDate() == null) {
			calendar.add(Calendar.DATE, 30);
			invoicePDFDto.setInvoiceDueDate(calendar.getTime());
		}
		// Fetching Client address from address table
		List<AddressDetailsEntity> addressDetailsEntities = addressRepository
				.findByClientId(projectEntity.getClientId());
		invoicePDFDto.setToCompanyAddress(addressDetailsEntities.get(0).getAddressLine() + ","
				+ addressDetailsEntities.get(0).getCity() + "-" + addressDetailsEntities.get(0).getPincode());
		invoicePDFDto.setToCompanyState(addressDetailsEntities.get(0).getState());
		float sum = 0;
		if (innvoiceDto.getClientBillingDtos() != null && !innvoiceDto.getClientBillingDtos().isEmpty()) {
			for (ClientBillingDto clientBillingDto : innvoiceDto.getClientBillingDtos()) {
				float mileStoneCost = clientBillingDto.getAmount();
				sum = sum + mileStoneCost;
			}
		}

		// Setting Gst amount if state code is same then cgst and sgst will be calculted
		// or igst will be calculated
		if (invoicePDFDto.getFromGstNo().substring(0, 2).equalsIgnoreCase(invoicePDFDto.getToGstNo().substring(0, 2))) {
			invoicePDFDto.setCGST(sum * 0.09);
			invoicePDFDto.setSGSTUTGS(sum * 0.09);
		} else {
			invoicePDFDto.setIGST(sum * 0.18);
		}
		invoicePDFDto.setBillWitoutGST(sum);
		invoicePDFDto.setBillWitGST((float) (sum + (sum * 0.18)));
		// Creating record of invoice pdf
		InvoicePDFEntity invoicePDFEntity = GenericMapper.mapper.map(invoicePDFDto, InvoicePDFEntity.class);
		invoicePDFEntity.setPoid(projectEntity.getPurchaseOrderId());
		invoicePDFEntity.setClientId(clientDetailsEntity.getId());
		invoicePDFEntity.setFromDate(innvoiceDto.getFromDate());
		invoicePDFEntity.setToDate(innvoiceDto.getToDate());
		invoicePDFEntity.setDescription(innvoiceDto.getDescription());
		invoicePDFEntity = invoicePDFRepository.save(invoicePDFEntity);

		// Updating balence amount in purchase order
		try {
			PurchaseOrderEntity purchaseOrderEntity = purchaseOrderRepository
					.findByIdAndActive(projectEntity.getPurchaseOrderId(), true).get();
			purchaseOrderEntity.setInvAmnt(sum);
			purchaseOrderEntity.setBalPoAmt(purchaseOrderEntity.getPoAmount() - sum);
			purchaseOrderRepository.save(purchaseOrderEntity);
		} catch (Exception e) {
			logger.error("InnoviceService:generatePDFForClientBilling:error while updating purchse order balence");
		}
		// Storing attendance details in DB
		if (innvoiceDto.getClientBillingDtos() != null && !innvoiceDto.getClientBillingDtos().isEmpty()) {
			for (ClientBillingDto clientBillingDto : innvoiceDto.getClientBillingDtos()) {
				ClientBillingInvoiceDetailEntity clientBillingInvoiceDetailEntity = new ClientBillingInvoiceDetailEntity();
				clientBillingInvoiceDetailEntity = GenericMapper.mapper.map(clientBillingDto,
						ClientBillingInvoiceDetailEntity.class);
				clientBillingInvoiceDetailEntity.setInvoiceId(invoicePDFEntity.getId());
				clientBillingInvoiceDetailEntity.setActive(true);
				clientBillingInvoiceDetailEntity.setProjectId(innvoiceDto.getProjectId());
				clientBillingRepository.save(clientBillingInvoiceDetailEntity);
			}
		}
		return new ResponseEntity<>(invoicePDFDto, headers, HttpStatus.OK);

	}

	public ResponseEntity<?> generatePDFForFixRate(InvoiceGenDto innvoiceDto) throws NoSuchAlgorithmException {
		rand = SecureRandom.getInstanceStrong();
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
		Calendar calendar = Calendar.getInstance();
		InvoicePDFDto invoicePDFDto = new InvoicePDFDto();
		// Fetching Project details on projectId
		ProjectEntity projectEntity = projectRepository.findById(innvoiceDto.getProjectId()).get();
		// Fetching client entity and setting related field
		ClientDetailsEntity clientDetailsEntity = clientDetailRepository.findByIdAndActive(projectEntity.getClientId(),
				true);

		int otp = rand.nextInt(1000) + 1000;
		invoicePDFDto.setPaid("DUE");
		invoicePDFDto.setDescription(innvoiceDto.getDescription());
		int nextYear = calendar.get(Calendar.YEAR) + 1;
		invoicePDFDto.setInvoiceDate(dateFormat.format(new Date()));
		invoicePDFDto
				.setInvoiceNo("RV/" + calendar.get(Calendar.YEAR) + "-" + String.valueOf(nextYear).substring(2) + otp);
		invoicePDFDto.setToCompanyName(clientDetailsEntity.getClientName());
		invoicePDFDto.setToGstNo(clientDetailsEntity.getGstNum());
		invoicePDFDto.setToPanNo(clientDetailsEntity.getTanNum());
		invoicePDFDto.setBillingType("Fixed Rate");

//If invoiceDueDate is null then adding 30 days to the from date
		if (invoicePDFDto.getInvoiceDueDate() == null) {
			calendar.add(Calendar.DATE, 30);
			invoicePDFDto.setInvoiceDueDate(calendar.getTime());
		}
		// Fetching Client address from address table
		List<AddressDetailsEntity> addressDetailsEntities = addressRepository
				.findByClientId(projectEntity.getClientId());
		invoicePDFDto.setToCompanyAddress(addressDetailsEntities.get(0).getAddressLine() + ","
				+ addressDetailsEntities.get(0).getCity() + "-" + addressDetailsEntities.get(0).getPincode());
		invoicePDFDto.setToCompanyState(addressDetailsEntities.get(0).getState());
		float sum = 0;
		if (innvoiceDto.getFixedRateInvoiceDetailDtos() != null
				&& !innvoiceDto.getFixedRateInvoiceDetailDtos().isEmpty()) {
			for (FixedRateInvoiceDetailDto fixedRateInvoiceDetailDto : innvoiceDto.getFixedRateInvoiceDetailDtos()) {
				float mileStoneCost = fixedRateInvoiceDetailDto.getAmount();
				sum = sum + mileStoneCost;
			}
		}

		// Setting Gst amount if state code is same then cgst and sgst will be calculted
		// or igst will be calculated
		if (invoicePDFDto.getFromGstNo().substring(0, 2).equalsIgnoreCase(invoicePDFDto.getToGstNo().substring(0, 2))) {
			invoicePDFDto.setCGST(sum * 0.09);
			invoicePDFDto.setSGSTUTGS(sum * 0.09);
		} else {
			invoicePDFDto.setIGST(sum * 0.18);
		}
		invoicePDFDto.setBillWitoutGST(sum);
		invoicePDFDto.setBillWitGST((float) (sum + (sum * 0.18)));
		// Creating record of invoice pdf
		InvoicePDFEntity invoicePDFEntity = GenericMapper.mapper.map(invoicePDFDto, InvoicePDFEntity.class);
		invoicePDFEntity.setPoid(projectEntity.getPurchaseOrderId());
		invoicePDFEntity.setClientId(clientDetailsEntity.getId());
		invoicePDFEntity.setFromDate(innvoiceDto.getFromDate());
		invoicePDFEntity.setToDate(innvoiceDto.getToDate());
		invoicePDFEntity.setDescription(innvoiceDto.getDescription());
		invoicePDFEntity = invoicePDFRepository.save(invoicePDFEntity);

		// Updating balence amount in purchase order
		PurchaseOrderEntity purchaseOrderEntity = purchaseOrderRepository
				.findByIdAndActive(projectEntity.getPurchaseOrderId(), true).get();
		purchaseOrderEntity.setInvAmnt(sum);
		purchaseOrderEntity.setBalPoAmt(purchaseOrderEntity.getPoAmount() - sum);
		purchaseOrderRepository.save(purchaseOrderEntity);
		// Storing attendance details in DB
		if (innvoiceDto.getFixedRateInvoiceDetailDtos() != null
				&& !innvoiceDto.getFixedRateInvoiceDetailDtos().isEmpty()) {
			for (FixedRateInvoiceDetailDto mileStoneDto : innvoiceDto.getFixedRateInvoiceDetailDtos()) {
				FixedRateInvoiceDetailEntity mileStoneEntity = new FixedRateInvoiceDetailEntity();
				mileStoneEntity = GenericMapper.mapper.map(mileStoneDto, FixedRateInvoiceDetailEntity.class);
				mileStoneEntity.setInvoiceId(invoicePDFEntity.getId());
				mileStoneEntity.setActive(true);
				mileStoneEntity.setProjectId(innvoiceDto.getProjectId());
				fixedRateInvoiceDetailRepository.save(mileStoneEntity);
			}
		}
		return new ResponseEntity<>(invoicePDFDto, headers, HttpStatus.OK);

	}

	public ResponseEntity<?> generatePDFPayableDays(InvoiceGenDto innvoiceDto) throws NoSuchAlgorithmException {
		rand = SecureRandom.getInstanceStrong();
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
		Calendar calendar = Calendar.getInstance();
		InvoicePDFDto invoicePDFDto = new InvoicePDFDto();
		// Fetching Project details on projectId
		ProjectEntity projectEntity = projectRepository.findById(innvoiceDto.getProjectId()).get();

		// Fetching client entity and setting related field
		ClientDetailsEntity clientDetailsEntity = clientDetailRepository.findByIdAndActive(projectEntity.getClientId(),
				true);

		// vALIDATION TO CHECK FOR PERTICULAR PROJECT AND DATE INVOICE IS GENERATED
		if (innvoiceDto.getProjectId() != null && innvoiceDto.getFromDate() != null) {
			List<InvoicePDFEntity> invoiceEntities = invoicePDFRepository.findinvoice(
					projectEntity.getPurchaseOrderId(), dateFormatAtt.format(innvoiceDto.getFromDate()),
					dateFormatAtt.format(innvoiceDto.getToDate()));
			if (invoiceEntities != null && !invoiceEntities.isEmpty()) {
				headers.add(Constants.STATUS, HttpStatus.CONFLICT.toString());
				headers.add(Constants.MESSAGE, "Invoice is already generated for given date");
				responceMap.put("Status", HttpStatus.CONFLICT);
				responceMap.put("fromDate", dateFormat.format(invoiceEntities.get(0).getFromDate()));
				responceMap.put("toDate", dateFormat.format(invoiceEntities.get(0).getToDate()));
				return new ResponseEntity<>(responceMap, headers, HttpStatus.OK);
			}
		}
		int otp = rand.nextInt(1000) + 1000;
		invoicePDFDto.setPaid("DUE");
		invoicePDFDto.setDescription(innvoiceDto.getDescription());
		invoicePDFDto.setBillingType("Payable Days");
		int nextYear = calendar.get(Calendar.YEAR) + 1;
		invoicePDFDto.setInvoiceDate(dateFormat.format(new Date()));
		invoicePDFDto
				.setInvoiceNo("RV/" + calendar.get(Calendar.YEAR) + "-" + String.valueOf(nextYear).substring(2) + otp);
		invoicePDFDto.setToCompanyName(clientDetailsEntity.getClientName());
		invoicePDFDto.setToGstNo(clientDetailsEntity.getGstNum());
		invoicePDFDto.setToPanNo(clientDetailsEntity.getTanNum());
//If invoiceDueDate is null then adding 30 days to the from date
		if (invoicePDFDto.getInvoiceDueDate() == null) {
			calendar.add(Calendar.DATE, 30);
			invoicePDFDto.setInvoiceDueDate(calendar.getTime());
		}
		// Fetching Client address from address table
		List<AddressDetailsEntity> addressDetailsEntities = addressRepository
				.findByClientId(projectEntity.getClientId());
		invoicePDFDto.setToCompanyAddress(addressDetailsEntities.get(0).getAddressLine() + ","
				+ addressDetailsEntities.get(0).getCity() + "-" + addressDetailsEntities.get(0).getPincode());
		invoicePDFDto.setToCompanyState(addressDetailsEntities.get(0).getState());

		float sum = 0;
		if (innvoiceDto.getInvoiceDetailDtos() != null && !innvoiceDto.getInvoiceDetailDtos().isEmpty()) {
			for (InvoiceDetailDto invoiceDetailDto : innvoiceDto.getInvoiceDetailDtos()) {
				sum = sum + invoiceDetailDto.getTotalAmt();
			}
		}

		// Setting Gst amount if state code is same then cgst and sgst will be calculted
		// or igst will be calculated
		if (invoicePDFDto.getFromGstNo().substring(0, 2).equalsIgnoreCase(invoicePDFDto.getToGstNo().substring(0, 2))) {
			invoicePDFDto.setCGST(sum * 0.09);
			invoicePDFDto.setSGSTUTGS(sum * 0.09);
		} else {
			invoicePDFDto.setIGST(sum * 0.18);
		}
		invoicePDFDto.setBillWitoutGST(sum);
		invoicePDFDto.setBillWitGST((float) (sum + (sum * 0.18)));
		// Creating record of invoice pdf
		InvoicePDFEntity invoicePDFEntity = GenericMapper.mapper.map(invoicePDFDto, InvoicePDFEntity.class);
		invoicePDFEntity.setPoid(projectEntity.getPurchaseOrderId());
		invoicePDFEntity.setClientId(clientDetailsEntity.getId());
		invoicePDFEntity.setFromDate(innvoiceDto.getFromDate());
		invoicePDFEntity.setToDate(innvoiceDto.getToDate());
		invoicePDFEntity.setDescription(innvoiceDto.getDescription());
		invoicePDFEntity = invoicePDFRepository.save(invoicePDFEntity);

		// Updating balence amount in purchase order
		PurchaseOrderEntity purchaseOrderEntity = purchaseOrderRepository
				.findByIdAndActive(projectEntity.getPurchaseOrderId(), true).get();
		purchaseOrderEntity.setInvAmnt(sum);
		purchaseOrderEntity.setBalPoAmt(purchaseOrderEntity.getPoAmount() - sum);
		purchaseOrderRepository.save(purchaseOrderEntity);
		// Storing attendance details in DB
		if (innvoiceDto.getInvoiceDetailDtos() != null && !innvoiceDto.getInvoiceDetailDtos().isEmpty()) {
			for (InvoiceDetailDto invoiceDetailDto : innvoiceDto.getInvoiceDetailDtos()) {
				InvoiceDetailEntity invoiceDetailEntity = new InvoiceDetailEntity();
				invoiceDetailEntity = GenericMapper.mapper.map(invoiceDetailDto, InvoiceDetailEntity.class);
				invoiceDetailEntity.setInvoiceId(invoicePDFEntity.getId());
				invoiceDetailEntity.setActive(true);
				invoiceDetailRepository.save(invoiceDetailEntity);
			}
		}
		return new ResponseEntity<>(invoicePDFDto, headers, HttpStatus.OK);

	}

	public ResponseEntity<?> listOfInvoice(int pageSize, int pageIndex, String invoiceId) {
		String billingType = invoicePDFRepository.findBillingTypeByInvoiceId(invoiceId);
		if (billingType.equalsIgnoreCase("Payable Days")) {
			return listOfInvoiceFrPayableDays(pageSize, pageIndex, invoiceId);
		} else if (billingType.equalsIgnoreCase("Mile Stone")) {
			return listOfInvoiceFrMileStone(pageSize, pageIndex, invoiceId);
		} else if (billingType.equalsIgnoreCase("Client Billing")) {
			return listOfInvoiceFrClientBilling(pageSize, pageIndex, invoiceId);
		} else {
			return listOfInvoiceFrFixRate(pageSize, pageIndex, invoiceId);
		}
	}

	public ResponseEntity<?> listOfInvoiceFrFixRate(int pageSize, int pageIndex, String invoiceId) {

		Pageable page = PageRequest.of(pageIndex, pageSize);
		List<FixedRateInvoiceDetailDto> resultListOfInvoice = null;
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		try {
			List<FixedRateInvoiceDetailEntity> tempResultInvoiceEntity = fixedRateInvoiceDetailRepository
					.findByInvoiceIdContaining(invoiceId, page);
			if (tempResultInvoiceEntity == null || tempResultInvoiceEntity.isEmpty()) {
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "There is no list of invoice");
				responceMap.put("Status", HttpStatus.OK);
			} else {
				Iterable<FixedRateInvoiceDetailEntity> iterable = tempResultInvoiceEntity;
				resultListOfInvoice = GenericMapper.mapper.mapAsList(iterable, FixedRateInvoiceDetailDto.class);
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.BILLING_TYPE, "Fix Rate");
				headers.add(Constants.MESSAGE, "List of invoice featched successfully");
				return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("ExpenceServiceImpl::create::" + e.getMessage());
			headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
			responceMap.put(Constants.MESSAGE, "Something went wrong");

		}

		return new ResponseEntity<>(responceMap, headers, HttpStatus.OK);
	}

	public ResponseEntity<?> listOfInvoiceFrPayableDays(int pageSize, int pageIndex, String invoiceId) {

		Pageable page = PageRequest.of(pageIndex, pageSize);
		List<InvoiceDetailDto> resultListOfInvoice = null;
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		try {
			List<InvoiceDetailEntity> tempResultInvoiceEntity = invoiceDetailRepository
					.findByInvoiceIdContaining(invoiceId, page);
			if (tempResultInvoiceEntity.isEmpty()) {
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "There is no list of invoice");
				responceMap.put("Status", HttpStatus.OK);
			} else {
				resultListOfInvoice = this.setListOfInvoice(tempResultInvoiceEntity);
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.BILLING_TYPE, "Payable Days");
				headers.add(Constants.MESSAGE, "List of invoice featched successfully");
				return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("ExpenceServiceImpl::create::" + e.getMessage());
			headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
			responceMap.put(Constants.MESSAGE, "Something went wrong");

		}

		return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
	}

	public ResponseEntity<?> listOfInvoiceFrMileStone(int pageSize, int pageIndex, String invoiceId) {

		Pageable page = PageRequest.of(pageIndex, pageSize);
		List<MileStoneDto> resultListOfInvoice = null;
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		try {
			List<MileStoneEntity> tempResultInvoiceEntity = mileStoneRepository.findByInvoiceIdContaining(invoiceId,
					page);
			if (tempResultInvoiceEntity == null || tempResultInvoiceEntity.isEmpty()) {
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "There is no list of invoice");
				responceMap.put("Status", HttpStatus.OK);
			} else {
				Iterable<MileStoneEntity> iterable = tempResultInvoiceEntity;
				resultListOfInvoice = GenericMapper.mapper.mapAsList(iterable, MileStoneDto.class);
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.BILLING_TYPE, "MileStone");
				headers.add(Constants.MESSAGE, "List of invoice featched successfully");
				return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("ExpenceServiceImpl::create::" + e.getMessage());
			headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
	}

	public ResponseEntity<?> listOfInvoiceFrClientBilling(int pageSize, int pageIndex, String invoiceId) {

		Pageable page = PageRequest.of(pageIndex, pageSize);
		List<ClientBillingDto> resultListOfInvoice = null;
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		try {
			List<ClientBillingInvoiceDetailEntity> tempResultInvoiceEntity = clientBillingRepository
					.findByInvoiceIdContaining(invoiceId, page);
			if (tempResultInvoiceEntity == null || tempResultInvoiceEntity.isEmpty()) {
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "There is no list of invoice");
				responceMap.put("Status", HttpStatus.OK);
			} else {
				Iterable<ClientBillingInvoiceDetailEntity> iterable = tempResultInvoiceEntity;
				resultListOfInvoice = GenericMapper.mapper.mapAsList(iterable, ClientBillingDto.class);
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.BILLING_TYPE, "MileStone");
				headers.add(Constants.MESSAGE, "List of invoice featched successfully");
				return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("ExpenceServiceImpl::create::" + e.getMessage());
			headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
			responceMap.put(Constants.MESSAGE, "Something went wrong");

		}

		return new ResponseEntity<>(resultListOfInvoice, headers, HttpStatus.OK);
	}

	private List<InvoiceDetailDto> setListOfInvoice(List<InvoiceDetailEntity> tempResultInvoiceEntity) {
		List<InvoiceDetailDto> resultInvoiceDto = new ArrayList<InvoiceDetailDto>();
		for (InvoiceDetailEntity invoiceEntity : tempResultInvoiceEntity) {
			/*
			 * ProjectEntity tempProjectEntity =
			 * this.getClientNameAndPersonNameByPojectId(invoiceEntity.getPerDayRate());
			 * InvoicePDFEntity tempInvoicePDFEntity=
			 * invoicePDFRepository.findByClientId(tempProjectEntity.getClientId(),
			 * invoiceEntity.getFromDate(), invoiceEntity.getToDate(),
			 * tempProjectEntity.getPurchaseOrder()); InvoiceListDTO tempObject = new
			 * InvoiceListDTO(tempProjectEntity.getClientName(),
			 * invoiceEntity.getFromDate(), tempInvoicePDFEntity !=null ?
			 * tempInvoicePDFEntity.getInvoiceNo() :"",
			 * tempProjectEntity.getProjectManager(), invoiceEntity.getToDate(),
			 * invoiceEntity.getTotalInvAmt(), tempInvoicePDFEntity !=null ?
			 * tempInvoicePDFEntity.getId() :"");
			 */
			resultInvoiceDto.add(GenericMapper.mapper.map(invoiceEntity, InvoiceDetailDto.class));
		}
		return resultInvoiceDto;
	}

	private ProjectEntity getClientNameAndPersonNameByPojectId(String projectId) {
		return projectRepository.findByIdEntity(projectId);
	}

	public ResponseEntity<?> invoicePDFData(int pageIndex, int pageSize, String invoiceId) {
		InvoicePDFDto invoicePDFDto;
		responceMap = new HashMap<String, Object>();
		headers = Utilities.getDefaultHeader();
		Pageable page = PageRequest.of(pageIndex, pageSize);

		try {
			List<InvoicePDFEntity> invoicePDFEntity = invoicePDFRepository.findByIdContaining(invoiceId, page);
			if (invoicePDFEntity == null) {
				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "There is no list of invoice");
				responceMap.put("Status", HttpStatus.OK);
			} else {
				Iterable<InvoicePDFEntity> iterator = invoicePDFEntity;
				List<InvoicePDFDto> invoicePDFDtos = GenericMapper.mapper.mapAsList(iterator, InvoicePDFDto.class);

				headers.add(Constants.STATUS, HttpStatus.OK.toString());
				headers.add(Constants.MESSAGE, "Invoice featched successfully");
				return new ResponseEntity<>(invoicePDFDtos, headers, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error("ExpenceServiceImpl::create::" + e.getMessage());
			headers.add(Constants.STATUS, HttpStatus.INTERNAL_SERVER_ERROR.toString());
			headers.add(Constants.MESSAGE, "Something went wrong");
			responceMap.put("Status", HttpStatus.INTERNAL_SERVER_ERROR);
			responceMap.put(Constants.MESSAGE, "Something went wrong");

		}

		return new ResponseEntity<>(null, headers, HttpStatus.OK);
	}

	@Transactional
	public ResponseEntity<?> invoicePaid(String id) {
		headers = Utilities.getDefaultHeader();
		responceMap = new HashMap<String, Object>();
		int update = invoicePDFRepository.updatePaid(id, "PAID");

		if (update != 0) {
			headers.add(Constants.STATUS, HttpStatus.OK.toString());
			headers.add(Constants.MESSAGE, "Status  updated successfully");
			responceMap.put("Status", HttpStatus.OK);
			responceMap.put(Constants.MESSAGE, "Status  updated successfully");

		} else {
			headers.add(Constants.STATUS, HttpStatus.OK.toString());
			headers.add(Constants.MESSAGE, "No Data Found For SearchTerm");
			responceMap.put("Status", HttpStatus.NO_CONTENT.toString());

		}
		return new ResponseEntity<>(responceMap, headers, HttpStatus.OK);
	}
}
