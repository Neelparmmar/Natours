// src/context/UserContext.js
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookedTours, setBookedTours] = useState([]);
  return (
    <UserContext.Provider
      value={{ user, setUser, bookedTours, setBookedTours }}
    >
      {children}
    </UserContext.Provider>
  );
};
