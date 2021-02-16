import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import UsersApi from '../services/UsersApi';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        passwordConfirm : ""
    })

    const [errors, setErrors] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",  
        passwordConfirm : "" 
    })

    // Handle input 
    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setUser({...user, [name]:value})
    }


    // Handle Submit 
    const handleSubmit = async event => {
        event.preventDefault();
        const apiError = {};
        if (user.password !== user.passwordConfirm) {
            errors.passwordConfirm = "Les mots de passes ne concordent pas"
            setErrors(apiError)
            return
        }
        try {
            const response = await UsersApi.register(user)
            setErrors({})
            toast.info("Vous êtes enregisté")
            history.replace('/login')
        } catch ({response}) {
            const {violations} = response.data
            if(violations){
                violations.forEach(({propertyPath,message}) => {
                    apiError[propertyPath] = message
                })
                setErrors(apiError)
                toast.error('Erreurs dans le formulaire')
            }
        }
    }

    return ( <>
        <h1 className="mt-5 mb-4">Inscription</h1>
        <form onSubmit={handleSubmit}>
            <Field name="firstName" label="Prénom" placeholder="Prénom" error={errors.firstName} value={user.firstName} onChange={handleChange} />
            <Field name="lastName" label="Nom" placeholder="Nom" error={errors.lastName} value={user.lastName} onChange={handleChange} />
            <Field name="email" label="Email" type="email" placeholder="Email" error={errors.email} value={user.email} onChange={handleChange} />
            <Field name="password" label="Mot de passe" type="password" placeholder="Mot de passe" error={errors.password} value={user.password} onChange={handleChange} />
            <Field name="passwordConfirm" label="Confirmation mot de passe" placeholder="Mot de passe" error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange} />


            <div className="form-group">
                <button className="btn btn-success" type="submit">S'enregister</button>
                <Link className="btn btn-info" to="/login">Déja un compte?</Link>
            </div>
        </form>
    </> );
}
 
export default RegisterPage;