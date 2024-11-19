import React, { createContext, useState } from 'react';
const UserContext = createContext();

const UserProvider = ({ children }) => {

  //Hardcodee el nombre de usuario pero realmente cuando el usuario se logea tenemos que guardar el nombre de usuario correspondiente
  const [user, setUser] = useState('Juan Carlos');


  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

