import * as React from 'react';
import Box from '@mui/material/Box';
import uowImg from './images/uowImg.jpeg';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { postData } from './common.js';
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

export default function Home(props)
{
	const { setIsLoggedIn, setIsAdmin } = props;
	const { handleSubmit, reset, control } = useForm();

	const [open, setOpen] = React.useState(false);
	const [openSI, setOpenSI] = React.useState(false);
	const [openAdmin, setOpenAdmin] = React.useState(false);

	const handleClickOpen = () =>
	{
		setOpen(true);
	};
	const handleClickOpenSI = () =>
	{
		setOpenSI(true);
	};

	const handleClose = () =>
	{
		setOpen(false);
		setOpenSI(false);
		reset();
	};

	const onSubmit = async (data) =>
	{
		const postBody = { ...data };
		async function registerUser(postBody)
		{
			const url = "http://127.0.0.1:5000/user/create";
			const res = await postData(url, postBody);
			return res.data;
		}
		const { email = "", password = "" } = data;
		if (email && password)
		{
			localStorage.setItem("e", email);
			localStorage.setItem("p", password);
			await registerUser(postBody);
			handleClose();
			await setIsLoggedIn(true);
		}
	}

	const onSubmitSI = async (data) =>
	{
		const { email = "", password = "" } = data;
		if (email && password)
		{
			localStorage.setItem("e", email);
			localStorage.setItem("p", password);
			setIsLoggedIn(true);
			if (email === "admin" && password === "admin")
			{
				setIsAdmin(true);
			}
			handleClose();
		}
	}

	return (
		<React.Fragment>
			<div style={{ margin: '50px' }}>
				<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
					<img
						alt=""
						style={{ width: "70vh" }}
						src={uowImg}
					/>
					<div className='d-block p-y-20'>
						<Button variant="contained" className="m-r-20" onClick={handleClickOpen}>Register</Button>
						<Button variant="contained" className="m-l-20" onClick={handleClickOpenSI}>Log In</Button>
					</div>

				</Box>
			</div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Register Vehicle</DialogTitle>
				<DialogContent>
					<Box sx={{ width: 400, bgcolor: 'background.paper' }}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="container">
								<section style={{ paddingTop: '10px' }}>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="text" label="First Name" {...field} />}
										name="firstName"
										control={control}
									/>
								</section>
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="text" label="Last Name" {...field} />}
										name="lastName"
										control={control}
									/>
								</section>
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="number" label="Phone" {...field} />}
										name="phone"
										control={control}
									/>
								</section>
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="text" label="Vehicle Registration Number" {...field} />}
										name="vNum"
										control={control}
									/>
								</section>
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="email" label="Email" {...field} />}
										name="email"
										control={control}
									/>
								</section>
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="password" label="Password" {...field} />}
										name="password"
										control={control}
									/>
								</section>
								<DialogActions>
									<Button onClick={handleClose}>Cancel</Button>
									<Button type="submit">Register</Button>
								</DialogActions>
							</div>
						</form>
					</Box>
				</DialogContent>
			</Dialog>
			<Dialog open={openSI} onClose={handleClose}>
				<DialogTitle>Log In</DialogTitle>
				<DialogContent>
					{openAdmin ?
						<Button variant="text" onClick={() => setOpenAdmin(false)}>Log In as User</Button>
						:
						<Button variant="text" onClick={() => setOpenAdmin(true)}>Log In as Admin</Button>
					}
				</DialogContent>
				<DialogContent>
					<Box sx={{ width: 400, bgcolor: 'background.paper' }}>
						<form onSubmit={handleSubmit(onSubmitSI)}>
							<div className="container">
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type={openAdmin ? "text" : "email"} label={openAdmin ? "Admin Username" : "Email"} {...field} />}
										name="email"
										control={control}
									/>
								</section>
								<section>
									<Controller
										render={({ field }) => <TextField fullWidth variant="outlined" type="password" label={openAdmin ? "Admin Password" : "Password"} {...field} />}
										name="password"
										control={control}
									/>
								</section>
								<DialogActions>
									<Button onClick={handleClose}>Cancel</Button>
									<Button type="submit">Log In</Button>
								</DialogActions>
							</div>
						</form>
					</Box>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
}
