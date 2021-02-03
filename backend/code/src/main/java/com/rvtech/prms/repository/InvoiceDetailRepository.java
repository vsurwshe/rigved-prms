package com.rvtech.prms.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.rvtech.prms.entity.InvoiceDetailEntity;

public interface InvoiceDetailRepository extends CrudRepository<InvoiceDetailEntity, String> {

	@Query
	List<InvoiceDetailEntity> findByInvoiceIdContaining(String invoiceId, Pageable page);
}
