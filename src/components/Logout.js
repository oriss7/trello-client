import {useContext} from 'react';
import { AuthContext } from '../context/authContext.js';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
	const {onLogout} = useContext(AuthContext)

	const navigate = useNavigate();

	function handleClose() {
		navigate(-1);
	}

	return(
        <Popup handleClose={handleClose} className="logout-popup" disablePopupEffect={true}>
	        <h2>Log out of your account?</h2>
           	<p className="confirm-logout pointer" onClick={onLogout} >Log Out</p>
			<span className="logoutMiddleBorder"/>
            <p className="pointer" onClick={handleClose}> Cancel</p>
		</Popup>
	)
}