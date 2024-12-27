import React, { useState, useEffect } from 'react'
import './login.css';

export default function Login() {
    const [auth, setAuth] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const url = 'https://portfolio-cms-ncqv.onrender.com';// 'http://localhost:5001';
    
    useEffect(() => {
        localStorage.getItem('token') ? window.location.href = '/' : setAuth(false);
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(email, password);
        const response = await fetch(`${url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);
            window.location.href = '/';
            console.log(data);
        } else {
            console.error('Invalid credentials');
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, password})
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } else {
            console.error('Invalid credentials');
        }
    }


    return (
        <div>
            <div className="wrapper">
                <div className="card-switch">
                    <label className="switch">
                        {/* <input type="checkbox" className="toggle" /> */}
                            {/* <span className="slider"></span> */}
                            {/* <span className="card-side"></span> */}
                            <div className="flip-card__inner">
                                <div className="flip-card__front">
                                    <div className="title">Log in</div>
                                    <form className="flip-card__form" action="">
                                        <input className="flip-card__input" name="email" placeholder="Email" type="email" onChange={e => setEmail(e.target.value)}/>
                                        <input className="flip-card__input" name="password" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)}/>
                                        <button className="flip-card__btn" onClick={handleLogin}>Let`s go!</button>
                                    </form>
                                </div>
                                {/* <div className="flip-card__back">
                                    <div className="title">Sign up</div>
                                    <form className="flip-card__form" action="">
                                        <input className="flip-card__input" placeholder="Username" type="name" onChange={e => setUsername(e.target.value)}/>
                                        <input className="flip-card__input" name="email" placeholder="Email" type="email" onChange={e => setEmail(e.target.value)}/>
                                        <input className="flip-card__input" name="password" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)}/>
                                        <button className="flip-card__btn" onClick={handleRegister}>Confirm!</button>
                                    </form>
                                </div> */}
                            </div>
                    </label>
                </div>   
            </div>
        </div>
    )
}

