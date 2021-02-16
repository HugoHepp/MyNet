import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/pagination';
import ClientAPI from '../services/clientsAPI';




const ClientsPage = (props) => {

    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const itemsPerPage = 10;

    // Get clients from db 
    const fetchClients = async () => {
        try {
            const data = await ClientAPI.findAll();
            setClients(data);
        } catch(error) {
            console.log(error.response);
        }
    }

    // on page load, put client list on state
    useEffect(()=> {fetchClients()},[])

    // function to delete client
    const handleDelete = async id => {
        // Create copy of client to restore if failed
        const originalClients = [...clients];
        // Delete client for UI
        setClients(clients.filter(client => client.id !== id))
        // Try to delete from database, if failed restore
        try {
            await ClientAPI.delete(id);
        } catch {
            setClients(originalClients);
        }

    }

    // function to handle page change 
    const handlePageChange = (page) => setCurrentPage(page)

    // function to handle search
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // filter clients by research value
    const filteredClients = clients.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) || 
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase())
    );

    // Paginate data
    const paginatedClients = Pagination.getData(filteredClients, currentPage, itemsPerPage);

    return ( <>
        <div className="d-flex justify-content-between align-items-center mb-2 mt-5">
            <h3 className="mt-2 mb-4">Liste des clients</h3> 
            <Link to="/clients/new" className="btn btn-primary">Créer un client</Link>
        </div>


        <div className="form-group">
            <input type="text" className="form-control" placeholder="Rechercher" onChange={handleSearch} value={search}/>
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Factures</th>
                    <th>Montant total (€)</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedClients.map(client => (
                <tr key={client.id}>
                    <td className="text-center">{client.id}</td>
                    <td>
                    <Link to={"/clients/" + client.id}>{client.firstName + " " + client.lastName}</Link>
                    </td>
                    <td>{client.email}</td>
                    <td>{client.company}</td>
                    <td className="text-center">
                        <span className="badge badge-light">
                            {client.invoices.length}
                        </span>
                    </td>
                    <td>{client.totalAmount} €</td>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(client.id)} disabled={client.invoices.length > 0}>Supprimer</button>
                    </td>
                </tr>))} 
            </tbody>
        </table>

        {itemsPerPage < filteredClients.length &&
        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredClients.length} onPageChange={handlePageChange}/>  
        }              
       

    </>
    );
}
 
export default ClientsPage;