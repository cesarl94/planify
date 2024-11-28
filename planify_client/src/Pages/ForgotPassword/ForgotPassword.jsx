import React, { useState } from 'react';
import Navbar from '../../Componets/Navbar/Navbar';
import Footer from '../../Componets/Footer/Footer';
import exclamation from '../../Images/icons/exclamation.png';
import "./ForgotPassword.css";
import { Navigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [Error, SetError] = useState(false);
    const [Email, SetEmail] = useState('');
    const [Confirm, SetConfirm] = useState(false);

    const HandleValidateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(Email)) {
            SetError(true);
        } else {
            SetError(false);
            SetConfirm(true);
        }
    };

    return (
        <div className='container-body'>
            <nav><Navbar /></nav>
            <main className='d-flex align-items-center justify-content-center'>
                <div className='login-card col-md-6 col-12 text-center'>
                    <h3 className='mt-3'>Forgot Password</h3>
                    <div className="d-flex justify-content-center">
                        <div className="col-10 col-sm-8">
                            <div>
                                <input
                                    type='email'
                                    placeholder='Enter your email'
                                    className='col-12 border rounded-2 my-2'
                                    onChange={(event) => { SetEmail(event.target.value) }}
                                />
                                {Error && (!Email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) && (
                                    <p className='text-danger m-0 text-start'>Please enter a valid email address.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type='sumbit' className='py-1 px-5 mt-2 mb-3 rounded-3 Button-Login' onClick={HandleValidateEmail}>Send recover mail</button>
                        {Confirm && <><Navigate to="/SentEmail"></Navigate></>}
                    </div>

                    {Error && (
                        <div className='d-sm-flex align-items-center justify-content-center'>
                            <img src={exclamation} width={'30px'} height={'30px'} className='me-2 mb-5' alt="exclamation icon" />
                            <p className='text-danger mb-5'>Invalid email. Please try again</p>
                        </div>
                    )}
                </div>
            </main>
            <footer><Footer /></footer>
        </div>
    );
};

export default ForgotPassword;