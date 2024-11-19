import React from 'react';
import Navbar from '../../Componets/Navbar/Navbar';
import Footer from '../../Componets/Footer/Footer';
import './Home.css';
import '../../Global.css';
import CreateBoard from '../../Componets/Board/CreateBoard/CreateBoard';
import StatusCard from '../../Componets/Board/StatusCard/StatusCard';

const Home = () => {
  return (
    <div className="container">
      <nav><Navbar /></nav>
      
      <main>
        <CreateBoard />
        {/* Contenedor que maneja el scroll horizontal */}
        <div className="main-scroll-container">
          <StatusCard />
        </div>
      </main>
      
      <footer><Footer /></footer>
    </div>
  );
};

export default Home;
