
import React, { useState } from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import "./Login.css"
const Login = () => {
    
    return (
        <div className='container-body'>
            <nav><Navbar /></nav>
            <main className='d-flex  align-items-center justify-content-center'>
                <div className='login-card col-6 text-center'>

                    <h3 className='mt-3'>Welcome!!</h3>

                    <div className="d-flex justify-content-center">
                        <div className="col-8">
                            <div>
                                <input type='text' placeholder='Enter your email' className='col-12 border rounded-2 my-2'></input>
                                <input type='password' placeholder='Enter your password' className='col-12 border rounded-2 '></input>
                            </div>
                            <div className='text-end'>
                                <a className='Link-Login'>I forgot my password</a>
                            </div>
                        </div>
                    </div>
                    <div>
                    <button className='py-1 px-5 my-2 rounded-3 Button-Login'>Login</button>
                    </div>
                    <div className='my-2'>
                    <p>Don’t you have an account? <a href='/Register' className='text-dark'>Register here</a></p>
                    </div>
                </div>

            </main>
            <footer><Footer /></footer>
        </div>
    )
}

export default Login
