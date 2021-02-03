package com.rvtech.prms.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.rvtech.prms.entity.AttendanceEntity;

public interface AttendanceRepository extends CrudRepository<AttendanceEntity, String> {

	@Query(value = "SELECT * FROM attendance WHERE accountId=:accountId  AND (date(fromDate) BETWEEN :fDate AND :tDate OR date(toDate) BETWEEN :fDate AND :tDate)", nativeQuery = true)
	List<AttendanceEntity> findattendance(@Param(value = "accountId") String accountId,
			@Param(value = "fDate") String fDate,@Param(value = "tDate") String tDate);

	@Query(value = "SELECT date(fromDate),date(toDate) from attendance where accountId=:accountId order by date(fromDate) desc limit 1", nativeQuery = true)
	String findAttendanceToAndFromDate(@Param(value = "accountId") String accountId);
	
	@Query(value = "SELECT date(fromDate),date(toDate) from attendance where accountId=:accountId order by date(fromDate) ", nativeQuery = true)
	List<String> findAllAttendanceToAndFromDate(@Param(value = "accountId") String accountId);
	
	@Query(value = "SELECT  count(*)  FROM  attendance WHERE ((:tDate BETWEEN DATE(fromDate) AND DATE(toDate)) OR (:froDate BETWEEN DATE(fromDate) AND DATE(toDate)) OR (:froDate < DATE(fromDate)  AND :tDate > date(toDate))) and employeeId like '%':empId'%'",nativeQuery=true)
	int findAttendanceEntry(@Param(value = "froDate") String froDate,@Param(value = "tDate") String tDate,@Param(value = "empId") String empId);
}
