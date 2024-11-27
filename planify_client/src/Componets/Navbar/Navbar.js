import React, { useContext, useState } from 'react'
import './Navbar.css'
import Logo from '../../Images/Logo.png'
import IconUser from '../../Images/icons/user.png'
import { UserContext } from '../../Context/UserContext'
import { Link, useLocation } from 'react-router-dom'
const Navbar = () => {
  const [Logged, Setlogged] = useState(false)
  const { user } = useContext(UserContext)
  const location = useLocation();
  return (
    <div className='Navbar-Container'>

      <Link to='/'><img src={Logo} width='180px'></img></Link>


      {!Logged && (
        <>
          {location.pathname === '/login' ? (
            <Link className='User_Navbar' to='/register'>
              <p>Register</p>
              <img src={IconUser} className='IconUser_Navbar' alt="User Icon" />
            </Link>
          ) : (
            <Link className='User_Navbar' to='/login'>
              <p>Login</p>
              <img src={IconUser} className='IconUser_Navbar' alt="User Icon" />
            </Link>
          )}
        </>
      )}

      {Logged && <>
        <div className='User_Navbar'>
          <p>{user}</p>
          <img src={IconUser} className='IconUser_Navbar'></img>
        </div>
      </>}
    </div>
  )
}

export default Navbar
