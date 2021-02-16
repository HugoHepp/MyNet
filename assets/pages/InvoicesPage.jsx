import React, { useEffect, useState } from 'react';
import Pagination from '../components/pagination';
import axios from 'axios'
import moment from 'moment'
import invoicesAPI from '../services/invoicesAPI'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const STATUS_CLASSES = {
    PAID: "success",
    WAIT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABEL = 
{
    PAID: "Payée",
    WAIT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [invoices, setInvoices] = useState([]);

    const itemsPerPage = 10;


    useEffect(() => {
        fetchInvoices();
    },[])

    // Get invoices from API
    const fetchInvoices = async () => {
        try{
            const data = await invoicesAPI.findAll();
            setInvoices(data);
        } catch(error) {
            console.log(error.response);
        }
    }


    // function change page 
    const handlePageChange = (page) => setCurrentPage(page)


    // Handle search value 
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }


    // Search from value 
    const filteredInvoices = invoices.filter(
        i => i.client.firstName.toLowerCase().includes(search.toLowerCase()) ||
             i.client.lastName.toLowerCase().includes(search.toLowerCase()) ||
             i.amount.toString().startsWith(search.toLowerCase()) ||
             STATUS_LABEL[i.status].toLowerCase().includes(search.toLowerCase())
    )


    // Delete invoice from API 
    const handleDelete = async id => {

        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice=> invoice.id !== id))

        try{
           await invoicesAPI.delete(id);
        } catch(error) {
            console.log(error.respone);
            setInvoices(originalInvoices);
            toast.error('Impossible de supprimer')
        }
    }


    
    // Paginate data
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    // Format date 
    const formatDate = (str) => moment(str).format('DD/MM/YYYY')


    return ( <>
    <div className="d-flex justify-content-between align-items-center mt-5">
        <h3 className="mt-2 mb-4">Liste des factures</h3>
        <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
    </div>
        

        <div className="form-group">
            <input type="text" className="form-control" placeholder="Rechercher" onChange={handleSearch} value={search}/>
        </div>
        
        <table className="table table-hover col-12">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant (€)</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedInvoices.map(invoice => 
                    
                    <tr key={invoice.id}>
                        <td>{invoice.id}</td>
                        <td>
                        <Link to={"/clients/" + invoice.client.id}>{invoice.client.firstName} {invoice.client.lastName}</Link>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABEL[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount} €</td>
                        <td>
                            <Link to={"/invoices/"+invoice.id} className="btn btn-outline-primary mr-1">Editer</Link>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredInvoices.length} onPageChange={handlePageChange} />



    </> );
}
 
export default InvoicesPage