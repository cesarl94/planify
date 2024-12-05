import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import exclamation from '../../Images/icons/exclamation.png'
import "./RecoverPassword.css"
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

const RecoverPassword = () => {

  const [Error, SetError] = useState(false)
  const [Confirm, SetConfirm] = useState(false)
  const [Password1, SetPassword1] = useState('')
  const [Password2, SetPassword2] = useState('')
  const [ShowPassword, SetShowPassword] = useState(false); // Estado para controlar si la contraseña se muestra como texto o como puntos (password).

  const HandleValidateRecoverPassword = () => {

    if (
      Password1.length < 8 || // Valida que la contraseña tenga al menos 8 caracteres.
      Password1 !== Password2 // Valida que las contraseñas ingresadas coincidan.
    ) {
      SetError(true);
      // Si alguna de las validaciones falla, se establece el estado de error en true.
    } else {
      SetError(false);
      SetConfirm(true);
      // Si todas las validaciones pasan, se muestra confirmación de registro.
    }

  };

  return (
    <div className='container-body'>
      <nav><Navbar /></nav>
      <main className='d-flex  align-items-center justify-content-center'>
        <div className='login-card col-12 col-md-6 text-center'>

          <h3 className='mt-3'>Hello FullName</h3>
          <h3 className='mb-3'>Create a new password</h3>

          <div className="d-flex justify-content-center">
            <div className="col-10 col-sm-8">
              <div>
                <div className="position-relative">  {/* Contenedor con clase para posicionar el botón de mostrar contraseña */}
                  <input type={ShowPassword ? 'text' : 'password'} // Cambia el tipo de input entre texto y password según el estado.
                    placeholder='Enter your password' className='col-12 border rounded-2 my-2' onChange={(event) => (SetPassword1(event.target.value))}></input>
                  {/* Botón pequeño posicionado a la derecha del input. - Cambia el estado para alternar entre mostrar y ocultar la contraseña. - Texto dinámico que muestra 'Show' o 'Hide' según el estado actual. */}
                  <button type="button" className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2" onClick={() => SetShowPassword(!ShowPassword)}> {ShowPassword ? 'Hide' : 'Show'} </button>
                </div>
                {Error && (Password1.length < 8) && ( // Muestra un mensaje de error si la contraseña tiene menos de 8 caracteres.
                  <p className='text-danger m-0 text-start'>Password must be at least 8 characters long.</p>
                )}

                <input type='password' placeholder='Repeat your password' className='col-12 border rounded-2 my-2' onChange={(event) => (SetPassword2(event.target.value))}></input>
                {Error && Password2 !== Password1 && (
                  <p className='text-danger m-0 text-start'>Passwords do not match.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button type='sumbit' className='py-1 px-5 mt-2 mb-3 rounded-3 Button-Login' onClick={HandleValidateRecoverPassword}>Reset password</button>
            {Confirm && <><Navigate to="/PasswordRecovered"></Navigate></>}
          </div>
          {Error && <>
            <div className='m-1 d-sm-flex align-items-center justify-content-center '>
              <img src={exclamation} width={'30px'} height={'30px'} className='me-2'></img>
              <p className='text-danger m-0'>Invalid credentials. Please try again</p>
            </div>
          </>}
        </div>

      </main>
  
    </div>
  );
};

export default RecoverPassword
