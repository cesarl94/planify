import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import "./Register.css"

const Register = () => {
  return (
    <div className='container-body'>
      <nav><Navbar /></nav>
      <main className='d-flex  align-items-center justify-content-center'>
        <div className='login-card col-6 text-center'>

          <h3 className='mt-3'>Ready to join us?</h3>

          <div className="d-flex justify-content-center">
            <div className="col-8">
              <div>
                <input type='text' placeholder='Enter your full name' className='col-12 border rounded-2 my-2'></input>
                <input type='email' placeholder='Enter your email' className='col-12 border rounded-2 my-2'></input>
                <input type='password' placeholder='Enter your password' className='col-12 border rounded-2 my-2'></input>
                <input type='password' placeholder='Repeat your password' className='col-12 border rounded-2 my-2'></input>
              </div>
            </div>
          </div>
          <div>
            <a href="/RegisterEnded"><button className='py-1 px-5 mt-2 mb-3 rounded-3 Button-Login'>Register</button></a>
          </div>
        </div>

      </main>
      <footer><Footer /></footer>
    </div>
  ) 
}

export default Register
