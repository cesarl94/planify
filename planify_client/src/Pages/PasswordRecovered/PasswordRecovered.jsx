import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import "./PasswordRecovered.css"

const PasswordRecovered = () => {
    return (
        <div className='container-body'>
            <nav><Navbar /></nav>
            <main className='d-flex align-items-center justify-content-center'>
                <div className='login-card col-12 col-md-6 text-center'>
                    <h3 className='mt-3'>Password successfully reset!</h3>

                    <div className="d-flex justify-content-center">
                        <div className="col-8">
                            <div>
                                <a href="/"><button className='my-5 py-1 px-5 my-2 rounded-3 Button-Login'>Continue</button></a>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default PasswordRecovered
