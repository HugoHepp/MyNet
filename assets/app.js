import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import PrivateRoute from './components/privateRoute';
import AuthContext from "./contexts/AuthContext";
import ClientsPage from './pages/ClientsPage';
import ClientPage from './pages/ClientPage';
import HomePage from './pages/Homepage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI';
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/footer';



AuthAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated())

    const NabarWithRouter = withRouter(Navbar);



    return (
        <div className="row">
            <div className="col-12">
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NabarWithRouter />
                <main className="container">
                    <Switch>

                        <Route path="/login" component={LoginPage}/>

                        <Route path="/register" component={RegisterPage}/>

                        <PrivateRoute path="/clients/:id" component={ClientPage} />

                        <PrivateRoute path="/clients" component={ClientsPage} />

                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />

                        <PrivateRoute path="/invoices" component={InvoicesPage} />

                        <Route path="/" component={HomePage}/>

                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_CENTER}/>
        </AuthContext.Provider>
        </div>
    </div>
    );
}

const rootElement = document.querySelector('#app');

ReactDOM.render(<App />,rootElement); 