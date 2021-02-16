import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import clientsAPI from '../services/clientsAPI'

const ClientPage = ({match,history}) => {

    const {id = "new"} = match.params;

    const [client, setClient] = useState({
        lastName : "",
        firstName : "",
        email : "",
        company :  ""
    })

    const [editing, setEditing] = useState(false)

    // Get client by its id
    const fetchClient = async (id) => {
        try {
        const {firstName, lastName, email, company} = await clientsAPI.find(id)
        
        setClient({firstName,lastName,email,company})

        } catch (error) {
            console.log(error.response)
            history.replace('/clients')
        }
    }
    // load client if needed
    useEffect(() => {
        if(id !== "new"){
            setEditing(true)
            fetchClient(id)
        }
    },[id])

    const [error, setError] = useState({
        lastName : "Le nom est obligatoire",
        firstName : "Le nom est obligatoire",
        email : "l'email est obligatoire",
        company :  "L'entreprise est obligatoire",
    })

    // Handle input change in form
    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setClient({...client, [name]:value})
    }

    // handle submit of form
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await clientsAPI.update(id, client)
            } else {
                console.log("Création du client")
                await clientsAPI.create(client)
            }
            setError({})
            history.replace("/clients")
        } catch ({response}) {
            const {violations} = response.data
            if(violations){
                const apiError = {};
                violations.forEach(({propertyPath,message}) => {
                    apiError[propertyPath] = message
                })
                setError(apiError)
            }
        }
    }



    return ( <>
    
        {!editing && <h1>creation client</h1> || <h1>Modification d'un client</h1>}

        <form onSubmit={handleSubmit}>
            <Field name="lastName" label="Nom de famille" placeholder="Nom de famille du client" value={client.lastName} onChange={handleChange} error={error.lastName} />
            <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={client.firstName} onChange={handleChange} error={error.firstName}/>
            <Field name="email" label="Email" placeholder="Email du client" value={client.email} onChange={handleChange} error={error.email}/>
            <Field name="company" label="Entreprise" placeholder="Entreprise du client"value={client.company} onChange={handleChange} error={error.company} />

            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregister</button>
                <Link to="/clients" className="btn btn-link">Retour</Link>
            </div>

        </form>
        
    </> );
}
 
export default ClientPage;