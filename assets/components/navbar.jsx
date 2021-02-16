import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthAPI from "../services/authAPI"
import AuthContext from "../contexts/AuthContext"


const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.push('/login');
    }

    return ( 
        <nav className="navbar navbar-expand-lg items-align-center">
            <a className="navbar-brand" href="#">MyNet</a>

                <ul className="navbar-nav mr-auto">

                    <li className="nav-item">
                        <NavLink to="/clients" className="nav-link" href="#">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/invoices" className="nav-link" href="#">Factures</NavLink>
                    </li>

                </ul>

                {(!isAuthenticated && <>   
                    <NavLink to="/login" className="nav-link">Connexion</NavLink>
                    <NavLink to="/register" className="nav-link">Inscription</NavLink>              
                </>) || (
                     <button onClick={handleLogout} className="nav-link" style={{border:"none", background:"transparent"}}>Déconnexion</button>
                )}

            
        </nav>

     );
}
 
export default Navbar;