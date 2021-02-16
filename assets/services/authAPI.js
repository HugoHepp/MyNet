import axios from 'axios';
import jwtDecode from 'jwt-decode'
import { LOGIN_API } from '../config';


/**
 * Http Request for authentication and storage of the token on localStorage and Axios
 * @param {object} credentials 
 */
async function authenticate(credentials){
    // Get Token 
  return axios
   .post(LOGIN_API, credentials)
   .then(response => response.data.token)
   .then(token => {
        // Store Token 
        window.localStorage.setItem("authToken", token)
        // Tell axios about the default header for future requests
        setAxiosToken(token)  
    })
}


/**
 * Setup on website load
 */
function setup()
{
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp:expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime / 1000){
            setAxiosToken(token)    
        } 
    } 
}



/**
 * Add token to axios header
 * @param {string} token 
 */
function setAxiosToken(token)
{
    axios.defaults.headers["Authorization"] = "Bearer " + token;  
}



/*
 *Delete Token of localStorage and axios
 */
function logout()
{
    window.localStorage.removeItem("authToken")
    delete axios.defaults.headers["Authorization"];
}



/**
 * Check authentication, return boolean
 */
function isAuthenticated(){

    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp:expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()){
            console.log("it should return true")
            return true   
        }

        return false 
    }
    return false 
}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};