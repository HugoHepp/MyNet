import React, {useContext, useState} from 'react';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';

const LoginPage = ({history}) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("");

    // Handle inputs
    const handleChange = ({currentTarget}) => {
        const {value,name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    // Handle submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError("")
            setIsAuthenticated(true)
            toast.info('Vous êtes connecté')
            history.replace("/clients")

        } catch (error) {
            setError("Aucun compte lié à cette adresse ou les informations ne correspondent pas.");
            toast.error('Erreurs dans le formulaire')
        }
    }

    return ( <>
    
    <h1 className="mt-5 mb-4">Connexion</h1>

    <form onSubmit={handleSubmit}>
        <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange} placeholder="Adresse email" error={error} />
        <Field label="Mot de passe" name="password" value={credentials.password} onChange={handleChange} type="password" placeholder="Mot de passe" error="" />

        <div className="form-group">
            <button className="btn btn-success">
                Connexion
            </button>
        </div>
    </form>
    
    </> );
}
 
export default LoginPage;