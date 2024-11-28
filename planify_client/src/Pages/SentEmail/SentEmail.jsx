import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import "./SentEmail.css"

const SentEmail = () => {
  return (
    <div className='container-body'>
      <nav><Navbar /></nav>
      <main className='d-flex  align-items-center justify-content-center'>
        <div className='login-card col-12 col-md-6 text-center'>
          <h3 className='mt-3'>A recovery link has been sent to the specified email address.</h3>

          <div className="d-flex justify-content-center">
            <div className="col-8">
              <p className='mt-3'>Please check your inbox and follow the instructions to reset your password.</p>
              <p className='mt-3'>Didn’t receive the email? <a href='/SentEmail' className='text-dark'>Send it again,</a> or close this tab if you no longer need it.</p>
            </div>
          </div>
        </div>

      </main>
      <footer><Footer /></footer>
    </div>
  )
}

export default SentEmail