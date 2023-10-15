import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { getData } from './common.js'
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

function TablePaginationActions(props)
{
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event) =>
	{
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event) =>
	{
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event) =>
	{
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event) =>
	{
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};

function createData(obj)
{
	const vNum = obj.vNum;
	const vSDate = obj.vDate;
	const vSTime = obj.vTime;
	const isDefaulter = obj.isDefaulter;
	const pNum = obj.pNum;
	const isVerified = obj.isVerified;
	const name = obj.firstName + " " + obj.lastName;
	return { vNum, vSDate, vSTime, isDefaulter, pNum, isVerified, name };
}

export default function UserList(props)
{
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [rows, setRows] = React.useState([]);
	const { isAdmin = false } = props;

	React.useEffect(() =>
	{
		const fetchData = async () =>
		{
			const url = isAdmin ? "http://127.0.0.1:5000/users" : "http://127.0.0.1:5000/user";
			const res = await getData(url, !isAdmin ? "email=" + localStorage.getItem('e') : "");
			setRows(res.data);
		}
		fetchData();
	}, [isAdmin])

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const handleChangePage = (event, newPage) =>
	{
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) =>
	{
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<React.Fragment>
			<div className="m-x-20">
				<div className="p-y-20 d-flex">
					<Typography
						variant="h6"
						noWrap
						component="div"
						align="left"
					>
						All transits {!isAdmin ? ('for ' + localStorage.getItem("e")) : ""}
					</Typography>
				</div>
				<Paper sx={{ width: '100%', overflow: 'hidden' }}>
					<TableContainer sx={{ maxHeight: 500 }}>
						<Table sx={{ minWidth: 500 }} stickyHeader aria-label="User list table">
							<TableHead>
								<TableRow>
									<StyledTableCell>Vehcile Registration Number</StyledTableCell>
									{isAdmin && <StyledTableCell>Owner Name</StyledTableCell>}
									<StyledTableCell align="left">Entry Date</StyledTableCell>
									<StyledTableCell align="left">Entry Time</StyledTableCell>
									<StyledTableCell align="left">Number of Persons</StyledTableCell>
									<StyledTableCell align="left">Defaulter</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.length > 0 && (rowsPerPage > 0
									? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									: rows
								).map((item) =>
								{
									const row = createData(item)
									return (
										<TableRow key={row.name}>
											<TableCell style={{ width: 250 }} component="th" scope="row">
												{row.vNum}{row.isVerified && (<VerifiedIcon style={{ fontSize: '16px', marginLeft: "10px", verticalAlign: "text-bottom" }} />)}
											</TableCell>
											{isAdmin && 
											<TableCell style={{ width: 160 }} align="left">
												{row.name}
											</TableCell>}
											<TableCell style={{ width: 160 }} align="left">
												{new Date(row.vSDate).toDateString("en-US")}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{row.vSTime}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{row.pNum}
											</TableCell>
											<TableCell align="left">
												{row.isDefaulter === 0 ? 'No' : 'Yes'}
											</TableCell>
										</TableRow>
									)
								})}

								{emptyRows > 0 && (
									<TableRow style={{ height: 53 * emptyRows }}>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[10, 20, 50, { label: 'All', value: -1 }]}
								colSpan={3}
								count={rows.length}
								rowsPerPage={rowsPerPage}
								page={page}
								SelectProps={{
									inputProps: {
										'aria-label': 'rows per page',
									},
									native: true,
								}}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Paper>
			</div>
		</React.Fragment>
	);
}
