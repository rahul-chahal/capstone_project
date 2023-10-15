import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function TopBar(props)
{
	const { isLoggedIn, setIsLoggedIn, setIsAdmin } = props;

	function logOut()
	{
		localStorage.removeItem("e");
		localStorage.removeItem("p");
		setIsLoggedIn(false);
		setIsAdmin(false);
	}

	return (
		<React.Fragment>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" style={{ background: '#1976D2', color: ' #ffffff' }}>
					<Toolbar>
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{ display: { xs: 'none', sm: 'block' } }}
						>
							UOW Carpool
						</Typography>
						<Box sx={{ flexGrow: 1 }} />
						{isLoggedIn &&
							<Stack direction="row" spacing={4}>
								<Button variant="contained" onClick={logOut} >
									Log out
								</Button>
							</Stack>
						}
					</Toolbar>
				</AppBar>
			</Box>
		</React.Fragment>
	);
}
