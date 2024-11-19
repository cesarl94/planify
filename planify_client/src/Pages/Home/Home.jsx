import React from 'react'
import Navbar from '../../Componets/Navbar/Navbar'
import Footer from '../../Componets/Footer/Footer'
import'./Home.css'
import '../../Global.css'
import CreateBoard from '../../Componets/CreatePlanifyBoard/CreateBoard'
const Home = () => {
  return (
    <div className="container">
      <nav><Navbar/> </nav>
      
      <main>
      <CreateBoard/>
        HOME
      </main>
      
      <footer><Footer/></footer>
    </div>
  )
}

export default Home
