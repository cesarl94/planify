import React, { useContext } from 'react'
import './Navbar.css'
import  Logo from '../../Images/Logo.png'
import IconUser from '../../Images/icons/user.png'
import { UserContext } from '../../Context/UserContext'
const Navbar = () => {

  const {user} = useContext(UserContext)
  return (
    <div className='Navbar-Container'>
      <img src={Logo} className='Logo_Navbar'></img>
      
      <div className='User_Navbar'>
        <p>{user}</p>
        <img src={IconUser} className='IconUser_Navbar'></img>
      </div>
    </div>
  )
}

export default Navbar
