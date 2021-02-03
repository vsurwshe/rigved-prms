package com.rvtech.prms.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.rvtech.prms.entity.InvoicePDFEntity;

public interface InvoicePDFRepository extends CrudRepository<InvoicePDFEntity, String> {

	@Query(value = "SELECT * FROM invoicepdf WHERE poid=:poid  AND (fromDate BETWEEN :fDate AND :tDate OR toDate BETWEEN :fDate AND :tDate) order by createdOn desc", nativeQuery = true)
	List<InvoicePDFEntity> findinvoice(@Param(value = "poid") String poid, @Param(value = "fDate") String fDate,
			@Param(value = "tDate") String tDate);

	@Query(value = "SELECT * FROM `invoicepdf` WHERE `clientId`=:ClientId AND `fromDate`=:fromDate AND `toDate`=:toDate AND poid=:poid", nativeQuery = true)
	InvoicePDFEntity findByClientId(@Param(value = "ClientId") String clientId,
			@Param(value = "fromDate") Date fromDate, @Param(value = "toDate") Date toDate,
			@Param(value = "poid") String poid);

	List<InvoicePDFEntity> findByIdContaining(String id, Pageable page);

	@Query(value = "SELECT pro.projectManager FROM project pro,invoicepdf innp where innp.poid=pro.purchaseOrderId and innp.id=:innvoiceId", nativeQuery = true)
	String managerNameQuery(@Param(value = "innvoiceId") String innvoiceId);

	@Modifying(clearAutomatically = true)
	@Query("UPDATE InvoicePDFEntity c SET c.paid = :paid WHERE c.id = :id")
	int updatePaid(@Param("id") String id, @Param("paid") String paid);

	@Query(value = "SELECT ROUND(sum(billWitGST),2) FROM invoicepdf where paid like '%Due%'  and DATEDIFF(date(sysdate()),date(createdOn)) > 30 and clientId=:clientId", nativeQuery = true)
	float findIvoiceFrReminder(@Param("clientId") String clientId);

	@Query(value = "SELECT ROUND(sum(billWitGST),2) FROM invoicepdf where paid like '%Due%' and DATEDIFF(date(sysdate()),date(createdOn)) between 20 and 30 and clientId=:clientId", nativeQuery = true)
	float findIvoiceFrReminderMoreThen10Days(@Param("clientId") String clientId);

	@Query(value = "SELECT * FROM invoicepdf where paid like '%Due%'  and clientId=:clientId", nativeQuery = true)
	List<InvoicePDFEntity> findIvoicePending(@Param("clientId") String clientId);

	@Query(value = "SELECT  con.email,con.name FROM contactperson con WHERE con.clientId=:clientId", nativeQuery = true)
	String contactPersonDetail(@Param("clientId") String clientId);

	@Query(value = "SELECT clientId FROM projectmanagment.invoicepdf group by clientId", nativeQuery = true)
	List<String> findClientId();

	@Query(value = "SELECT billingType FROM invoicepdf  where  id=:invPdfId ", nativeQuery = true)
	String findBillingTypeByInvoiceId(@Param("invPdfId") String invPdfId);
}
