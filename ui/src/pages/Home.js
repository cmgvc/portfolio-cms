import React, { useState, useEffect } from 'react'
import ContentManagementSystem from '../components/ContentManagementSystem';
import './home.css';

function Home() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        localStorage.getItem('token') ? setAuth(true) : setAuth(false);
    }
    , [])

    const handleRedirect = () => {
        window.location.href = '/login';
    }

    return (
        <div>
            { auth ? 
            <>
                <h1>Welcome to Your Content Management System!</h1>
                <ContentManagementSystem />
            </>
            : <div className='login'><button onClick={handleRedirect}>Login</button></div>
            }
        </div>
    )
}

export default Home;
