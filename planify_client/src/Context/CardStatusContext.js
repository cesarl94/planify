import React, { createContext, useState } from 'react';
const CardStatusContext = createContext();

const CardStatusProvider = ({ children }) => {


    //Stear los estamos cuando accedemos al endpoint ahora esta hardcodeado
    const [titles, setTitles] = useState([
        'Backlog',
        'To Do',
        'In Process',
        'Done'
      ]);

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

