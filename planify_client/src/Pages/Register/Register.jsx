import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import exclamation from '../../Images/icons/exclamation.png'
import "./Register.css"
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

const Register = () => {

  const [Error, SetError] = useState(false)
  const [User, SetUser] = useState('')
  const [Email, SetEmail] = useState('')
  const [Password1, SetPassword1] = useState('')
  const [Password2, SetPassword2] = useState('')

  const HandleValidateRegister = () => {

    if ((User == '') || (Email == '') || (Password1 == '') || (Password2 == '') || (Password2 != Password1)) {
      SetError(true)
    } else {
      SetError(false)
    }
  }

  return (
    <div className='container-body'>
      <nav><Navbar /></nav>
      <main className='d-flex  align-items-center justify-content-center'>
        <div className='login-card col-12 col-md-6 text-center'>

          <h3 className='mt-3'>Ready to join us?</h3>

          <div className="d-flex justify-content-center">
            <div className="col-10 col-sm-8">
              <div>
                <input type='text' placeholder='Enter your full name' className='col-12 border rounded-2 my-2' onChange={(event) => { SetUser(event.target.value) }}></input>
                {User == '' && <p className='text-danger m-0 text-start'>Please enter your full name</p>}
                <input type='email' placeholder='Enter your email' className='col-12 border rounded-2 my-2' onChange={(event) => { SetEmail(event.target.value) }}></input>
                {Email == '' && <p className='text-danger m-0 text-start'>Please enter your email</p>}
                <input type='password' placeholder='Enter your password' className='col-12 border rounded-2 my-2' onChange={(event) => (SetPassword1(event.target.value))}></input>
                {Password1 == '' && <p className='text-danger m-0 text-start'>Please enter your password</p>}
                <input type='password' placeholder='Repeat your password' className='col-12 border rounded-2 my-2' onChange={(event) => (SetPassword2(event.target.value))}></input>
                {Password2 == '' && <p className='text-danger m-0 text-start'>Please repeat your password</p>}
                {Password2 != Password1 && <p className='text-danger m-0 text-start'>Passwords do not match</p>}
              </div>
            </div>
          </div>
          <div>
            <button type='sumbit' className='py-1 px-5 mt-2 mb-3 rounded-3 Button-Login' onClick={HandleValidateRegister}>Register</button>
            {!Error && <><Navigate to="/RegisterEnded"></Navigate></>}
          </div>
          {Error && <>
            <div className='m-1 d-sm-flex align-items-center justify-content-center '>
              <img src={exclamation} width={'30px'} height={'30px'} className='me-2'></img>
              <p className='text-danger m-0'>Invalid credentials. Please try again</p>
            </div>
          </>}
        </div>

      </main>
      <footer><Footer /></footer>
    </div>
  )
}

export default Register
