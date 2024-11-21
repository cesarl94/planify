import React from 'react';
import Navbar from '../../Componets/Navbar/Navbar';
import Footer from '../../Componets/Footer/Footer';
import './Home.css';
import '../../Global.css';
import CreateBoard from '../../Componets/Board/CreateBoard/CreateBoard';
import StatusCard from '../../Componets/Board/StatusCard/StatusCard';

const Home = () => {

  return (
    <div className="container-body">
      <nav><Navbar /></nav>
      
      <main>
        <CreateBoard />
        <div>
          <StatusCard />
        </div>
      </main>
      
      <footer><Footer /></footer>
    </div>
  );
};

export default Home