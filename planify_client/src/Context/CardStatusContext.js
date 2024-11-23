import React, { createContext, useEffect, useState } from 'react';
const CardStatusContext = createContext();

const CardStatusProvider = ({ children }) => {


      const [titles, setTitles] = useState([]);
    
      const fetchTitles = async () => {
        try {
          const response = await fetch('http://localhost:4000/api/estados');
          const data = await response.json();
          const stateTitles = data.map(item => item.Nombre);
          setTitles(stateTitles);
        } catch (error) {
          console.error('Error al obtener los estados:', error);
        }
      };

      useEffect(() => {
        fetchTitles();
      }, []);

      const addTitle = (newTitle) => {
        setTitles((prevTitles) => [...prevTitles, newTitle]);
      };
      
      return (
        <CardStatusContext.Provider value={{ titles, addTitle }}>
          {children}
        </CardStatusContext.Provider>
      );
};

export { CardStatusContext, CardStatusProvider };

