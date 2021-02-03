package com.rvtech.prms.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rvtech.prms.common.FileDto;
import com.rvtech.prms.util.Utilities;

@RestController
@RequestMapping(path = "/file")
public class FileController {

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);

	@Autowired
	private AttendanceController attendanceController;

	@Autowired
	private RegistrationController registrationController;

	private String picFolderName = "PRMSImage";

	private MultiValueMap<String, String> headers = null;

	/*
	 * Uploading document byte array and returning path
	 */
	@PostMapping(path = "/upload", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> upload(@RequestBody List<FileDto> fileDtos) {
		String fileName = System.getProperty("user.dir");
		List<String> documentURLS = new ArrayList<String>();
		for (FileDto fileDto : fileDtos) {
			String filePath = fileName + File.separator + picFolderName + File.separator + fileDto.getDescription();
			byte[] bytes = fileDto.getContent();
			File file = new File(filePath);
			if (!file.exists()) {
				file.mkdirs();
			}
			String line = null;
			OutputStream os = null;
			try {
				os = new FileOutputStream(
						file + File.separator + fileDto.getFileName() + "." + fileDto.getContentType());
				os.write(bytes);
				System.out.println("Write bytes to file.");
				/*
				 * BufferedReader br = new BufferedReader(new FileReader(file)); while ((line =
				 * br.readLine()) != null) { System.out.println(line); } br.close();
				 */
				os.close();
				/*
				 * documentURLS.add( documentURL + fileDto.getFileName() + File.separator + date
				 * + "-" + fileDto.getDescription());
				 */
				documentURLS.add(filePath + File.separator + fileDto.getFileName() + "." + fileDto.getContentType());
			} catch (Exception e) {
				logger.error("FileUpload");
			}
		}
		if (fileDtos.get(0).getDescription().equalsIgnoreCase("attendance")) {
			if (parseExcel(documentURLS.get(0))) {
				attendanceController.readExcel(fileDtos.get(0).getFromAttedDate(), fileDtos.get(0).getToAttedDate(),
						documentURLS.get(0));
			} else {
				return new ResponseEntity<>(null, HttpStatus.CONFLICT);
			}
		}
		if (fileDtos.get(0).getDescription().equalsIgnoreCase("registration")) {
			//if (parseExcel(documentURLS.get(0))) {
				registrationController.readExcel(documentURLS.get(0));
			//} else {
			//	return new ResponseEntity<>(null, HttpStatus.CONFLICT);
			//}
		}
		return new ResponseEntity<List<String>>(documentURLS, HttpStatus.OK);

	}

	public Boolean parseExcel(String filePath) {
		try {
			// obtaining input bytes from a file
			FileInputStream fis = new FileInputStream(new File(filePath));
			if (filePath.substring(filePath.lastIndexOf(".") + 1).equalsIgnoreCase("xlsx")) {
				// creating Workbook instance that refers to .xlsx file
				XSSFWorkbook wb = new XSSFWorkbook(fis);
				XSSFSheet sheet = wb.getSheetAt(0); // creating a Sheet object to retrieve object
				return readAttendanceExcel(sheet);

			} else {
				HSSFWorkbook wb = new HSSFWorkbook(fis); // creating a Sheet object to retrieve the object
				HSSFSheet sheet = wb.getSheetAt(0); // evaluating cell type
				return readAttendanceExcel(sheet);
// FormulaEvaluator formulaEvaluator =
				// wb.getCreationHelper().createFormulaEvaluator();
			}

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	public Boolean readAttendanceExcel(Sheet sheet) {
		int totalCellCount = 0;
		for (Cell cell : sheet.getRow(0)) // iteration over cell using for each loop
		{

			if (cell != null) {
				totalCellCount++;
				// getting the value of the cell as a string
				String cellValue = cell.getStringCellValue();
				if (cell.getColumnIndex() == 0) {
					if (!cellValue.equalsIgnoreCase("Emp Code")) {
						return false;
					}
				}
				if (cell.getColumnIndex() == 1) {
					if (!cellValue.equalsIgnoreCase("Employee Name")) {
						return false;
					}

				}
				if (cell.getColumnIndex() == 2) {
					if (!cellValue.equalsIgnoreCase("Branch")) {
						return false;
					}
				}
				if (cell.getColumnIndex() == 3) {
					if (!cellValue.equalsIgnoreCase("Designation")) {
						return false;

					}
				}
				if (cell.getColumnIndex() == 4) {
					if (!cellValue.equalsIgnoreCase("Company")) {
						return false;

					}
				}

			} else {
			
					return false;
				}
			
		}
		if (totalCellCount > 50) {
			return true;
		} else {
			return false;
		}
	}

	@GetMapping("getFile/**")
	public ResponseEntity<InputStreamResource> getFile(HttpServletRequest request) {
		// String fileName = System.getProperty("user.dir");

		// .split(request.getContextPath() + "/getFile/")[1];
		InputStream is = null;
		try {
			File file = new File(request.getRequestURI().split("getFile/")[1]);
			is = new FileInputStream(file);
			return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(is));
		} catch (Exception e) {
			logger.error("Unable to get the flag", e);
		}
		is = FileController.class.getResourceAsStream("/images/document.png");
		return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(is));

	}

	@RequestMapping(value = "/getImage", method = RequestMethod.GET)
	public ResponseEntity<InputStreamResource> getImage(@RequestParam("filepath") String filepath) {
		// String fileName = System.getProperty("user.dir");
		InputStream is = null;
		try {
			File file = new File(filepath);
			is = new FileInputStream(file);
			return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(is));
		} catch (Exception e) {
			logger.error("Unable to get the flag", e);
		}
		is = FileController.class.getResourceAsStream("/images/document.png");
		return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(is));

	}

	@GetMapping("getRegXl")
	public ResponseEntity<?> getRegXl() {
		// String fileName = System.getProperty("user.dir");

		// .split(request.getContextPath() + "/getFile/")[1];
		headers = Utilities.getDefaultHeader();

		FileDto fileDto = new FileDto();
		InputStream is = null;
		try {
			String fileName = System.getProperty("user.dir");
			String filePath = fileName + File.separator + picFolderName + File.separator + "DemoRegistration"
					+ File.separator + "Registration.xlsx";
			byte[] encoded = Files.readAllBytes(Paths.get(filePath));
			fileDto.setContent(encoded);
			fileDto.setContentType("xlsx");
			fileDto.setFileName("Registration");
			return new ResponseEntity<>(fileDto, headers, HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Unable to get the flag", e);
		}
		is = FileController.class.getResourceAsStream("/images/document.png");
		return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(is));

	}
}
