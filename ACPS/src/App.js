import { useEffect, useState } from 'react';
import './App.css';
import TopBar from './TopBar';
import Home from './home';
import UserList from './UserList';

function App()
{
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() =>
	{
		const e = localStorage.getItem("e");
		const p = localStorage.getItem("p");
		const loginCheck = !!e && !!p;
		if (e === "admin" && p === "admin")
		{
			setIsAdmin(true);
		}
		setIsLoggedIn(loginCheck);
	}, [isLoggedIn, isAdmin])

	return (
		<div className="App">
			<TopBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} />

			{isLoggedIn ?
				<UserList isAdmin={isAdmin} />
				:
				<Home setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin}/>
			}
		</div>
	);
}

export default App;
