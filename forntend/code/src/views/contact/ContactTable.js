import React,{useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TableHead } from '@material-ui/core';
import useStyles from "../client/Styles";

const columns = [
    { id: 'key', label: 'Sr. No.', minWidth: 30 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email'},
    { id: 'mobileNum', label: 'Mobile Number'},
    { id: 'role', label: 'Job Designation'},
];
  
function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;
  const handleFirstPageButtonClick = (event) => { onChangePage(event, 0); };
  const handleBackButtonClick = (event) => { onChangePage(event, page - 1); };
  const handleNextButtonClick = (event) => { onChangePage(event, page + 1); };
  const handleLastPageButtonClick = (event) => { onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1)); };

  return (
    <div className={classes.clientTableRoot}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page" >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page" >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page" >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

// this function is used for the create the row data
function createData(key, name, email, mobileNum, role) { return { key,name, email, mobileNum, role }; }

const  ContactTable=(props)=>{
  const {data}= props
  // Creating rows
  const rows=(data && data.length >0 )&& data.map((item,key)=>{ return  createData((key+1),item.name,item.email,item.mobileNum, item.role) });  
  (rows && rows.length > 0) && rows.sort((a, b) => (a.key < b.key ? -1 : 1));
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows =  (rows && rows.length > 0) && rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => { setPage(newPage); };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return <TableContainer component={Paper}>
      <Table className={classes.clientTableTable} aria-label="custom pagination table">
        <TableHead>
            <TableRow>
              {columns.map((column) =>(<TableCell key={column.id} align={column.align} style={{minWidth: column.minWidth}}>{column.label}</TableCell>))}
            </TableRow>
        </TableHead>
        <TableBody>
          {/* this condition checking wheter rows is avilable or not */}
          {(rows && rows.length > 0) && (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rows)
          .map((row,key) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">{row.key}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.mobileNum}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (<TableRow style={{ height: 53 * emptyRows }}><TableCell colSpan={6} /></TableRow>)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows ? rows.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
}

export default ContactTable;