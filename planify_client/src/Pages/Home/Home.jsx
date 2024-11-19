import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import'./Home.css'
import '../../Global.css'
const Home = () => {
  return (
    <div className="container">
      <nav><Navbar/> </nav>
        
      <main>HOME</main>
      
      <footer><Footer/></footer>
    </div>
  )
}

export default Home
