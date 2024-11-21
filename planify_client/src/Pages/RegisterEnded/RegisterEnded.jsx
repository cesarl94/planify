import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import "./RegisterEnded.css"

const Register = () => {
  return (
    <div className='container-body'>
      <nav><Navbar /></nav>
      <main className='d-flex  align-items-center justify-content-center'>
        <div className='login-card col-12 col-md-6 text-center'>
          <h3 className='mt-3'>Your account has been successfully created!</h3>

          <div className="d-flex justify-content-center">
            <div className="col-8">
              <p className='mt-3'>Please check your email inbox to verify your account and complete the registration process within 24 hours.</p>
              <p className='mt-3'>Didn’t receive the email? <a href='/RegisterEnded' className='text-dark'>Send it again.</a></p>
            </div>
          </div>
          <div className='mb-5'>
            <a href='/RegisterEnded' className='text-dark'>Return to page</a>
          </div>
        </div>

      </main>
      <footer><Footer /></footer>
    </div>
  )
}

export default Register
