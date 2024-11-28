
import React, { useState } from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import exclamation from '../../Images/icons/exclamation.png'
import "./Login.css"
const Login = () => {

    const [Error, SetError] = useState(false)
    const [Email, SetEmail] = useState('')
    const [Password, SetPassword] = useState('')

    const HandleEmailChange = (email) =>{
            SetEmail(email);
    }

    const HandleValidateLogin = () =>{
        
        if((Email == '') || (Password == ''))
        {
            SetError(true)
        }else{
            SetError(false)
        }
    }
    
    return (
        <div className='container-body'>
            <nav><Navbar /></nav>
            <main className='d-flex  align-items-center justify-content-center'>
                <div className='login-card col-md-6 col-12 text-center'>

                    <h3 className='mt-3'>Welcome!!</h3>

                    <div className="d-flex justify-content-center">
                        <div className="col-10 col-sm-8">
                            <div>
                                <input type='email' placeholder='Enter your email' className='col-12 border rounded-2 my-2' onChange={(email)=>{HandleEmailChange(email.target.value)}}></input>
                                <input type='password' placeholder='Enter your password' className='col-12 border rounded-2' onChange={(password)=>(SetPassword(password.target.value))}></input>
                            </div>
                            <div className='text-end'>
                                <a href='/ForgotPassword' className='Link-Login'>I forgot my password</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='py-1 px-5 my-2 rounded-3 Button-Login' onClick={HandleValidateLogin}>Login</button>
                    </div>

                    {Error && <>
                    <div className=' d-sm-flex align-items-center justify-content-center '>
                        <img src={exclamation} width={'30px'} height={'30px'} className='me-2'></img>
                        <p className='text-danger m-0'>Invalid credentials. Please try again</p>
                    </div>
                    </>  }
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
