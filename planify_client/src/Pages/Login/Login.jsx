
import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import "./Login.css"
const Login = () => {
  return (
    <div className='container-body'>
        <nav><Navbar/></nav>
        <main className='d-flex  align-items-center justify-content-center'>
            <div className='login-card col-6 text-center'>
                
                <h3 className='mt-3'>Welcome!!</h3>

                <div className=''>
                    <input type='text' placeholder='Enter your email' className='col-8 border rounded-2 m-2'></input>
                    <input type='password' placeholder='Enter your password' className='col-8 border rounded-2 m-1'></input>
            
                    <p className='col-9 d-flex  align-items-center'>I forgot my password</p>
            
                </div>
            </div>
        </main>
        <footer><Footer/></footer>
    </div>
  )
}

export default Login
