package com.rvtech.prms.controller;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rvtech.prms.common.InnvoiceDto;
import com.rvtech.prms.common.InvoiceGenDto;
import com.rvtech.prms.services.InnviceServiceImpl;
import com.rvtech.prms.services.SchedularServiceImpl;

import io.swagger.annotations.Api;

@Api
@RestController
@RequestMapping("/innvoice")
public class InnviceController {

	@Autowired
	private InnviceServiceImpl innviceServiceImpl;

	@Autowired
	private SchedularServiceImpl schedularServiceImpl;

	@PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> create(@RequestBody InnvoiceDto innvoiceDto) {
		return innviceServiceImpl.create(innvoiceDto);
	}

	@PostMapping(path = "/createPDF", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> createPDF(@RequestBody InvoiceGenDto innvoiceDto) throws NoSuchAlgorithmException {
		return innviceServiceImpl.generatePDF(innvoiceDto);
	}

	@GetMapping(path = { "/invoiceList/{pageIndex}/{pageSize}",
			"/invoiceList/{pageIndex}/{pageSize}/{invoiceId:.+}" }, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> getInvoiceList(@PathVariable("pageSize") int pageSize,
			@PathVariable("pageIndex") int pageIndex, @PathVariable("invoiceId") Optional<String> invoiceId) {
		return innviceServiceImpl.listOfInvoice(pageSize, pageIndex, invoiceId.isPresent() ? invoiceId.get() : "");
	}

	@GetMapping(path = { "/invoicePDFData/{pageIndex}/{pageSize}/{invoiceId}",
			"/invoicePDFData/{pageIndex}/{pageSize}" }, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> invoicePDFData(@PathVariable("pageIndex") int pageIndex,
			@PathVariable("pageSize") int pageSize, @PathVariable("invoiceId") Optional<String> invoiceId) {
		return innviceServiceImpl.invoicePDFData(pageIndex, pageSize, invoiceId.isPresent() ? invoiceId.get() : "");
	}

	@GetMapping(path = "/invoicePaid/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> invoicePaid(@PathVariable("id") String id) {
		return innviceServiceImpl.invoicePaid(id);

	}

	@GetMapping(path = "/sendReminder", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public void sendReminder() {
		schedularServiceImpl.invoiceReminder();
	}
}
