import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import ClientsAPI from '../services/clientsAPI';
import axios from 'axios'
import InvoiceApi from '../services/invoicesAPI'

const InvoicePage = ({history, match}) => {

    const { id = "new" } = match.params;

    const [invoice,setInvoice] = useState({
        amount : "",
        client : "",
        status : "WAIT"
    })

    const [errors, setErrors] = useState({
        amount : "",
        client : "",
        status : ""
    })

    const [clients, setClients] = useState([])

    const [editing, setEditing] = useState(false)

    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setInvoice({...invoice, [name]:value})
    }

    // Handle Submit of form 
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            if (editing) {
                await InvoiceApi.update(id,invoice)
            } else {
                const response = await InvoiceApi.create(invoice)
            }
            history.replace("/invoices")
        } catch ({response}) {
            const {violations} = response.data
            if(violations){
                const apiError = {};
                violations.forEach(({propertyPath,message}) => {
                    apiError[propertyPath] = message
                })
                setError(apiError)
                toast.error('Erreurs dans le formulaire')
            }
        }
    }

    // Get client to populate form
    const fetchClients = async () => {
        try {
            const data = await ClientsAPI.findAll();
            if(!invoice.client) setInvoice({...invoice, client: data[0].id})
            setClients(data)
        } catch (error) {
            console.log(error.response)
            history.replace("/invoices")
        }
    }

    // Get invoice for modification form
    const fetchInvoice = async id => {
        try {
            const {amount, status, client}  = await InvoiceApi.find(id)
            setInvoice({amount,status,client:client.id})

        } catch (error) {
            console.log(error.response)
            toast.error('Facture non trouvée')
            history.replace("/invoices")
        }
    }

    // Get client list for form
    useEffect(() => {
        fetchClients();
    },[])

    // Get invoice for modification form pre-populate
    useEffect(()=>{
        if(id !== "new"){
            setEditing(true)
            fetchInvoice(id)
        }
    },[id])

    return ( <>
        {(editing && <h1 className="mt-5">Modification d'une facture</h1> || <h1 className="mt-5">Création d'une facture</h1>)}
        <form onSubmit={handleSubmit}>
            <Field name="amount" type="number" placeholder="Montant de la facture (€)" label="Montant" onChange={handleChange} value={invoice.amount} />

            <Select name="client" label="Client" value={invoice.client} error={errors.client} onChange={handleChange}>
                    {clients.map(client => {
                        return <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                    })}
            </Select>

            <Select name="status" label="status" value={invoice.status} error={errors.status} onChange={handleChange}>
                    <option value="WAIT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
            </Select>


            <div className="form-group">
                <button type="submit" className="btn btn-success mr-2">Enregistrer</button>
                <Link to="/invoices" className="btn btn-info">Retour</Link>
            </div>

        </form>
    </> );
}
 
export default InvoicePage;