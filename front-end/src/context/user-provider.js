import { useContext, createContext } from "react";
import { useUser } from "../hooks/useUser";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { user, setUser, isLoading } = useUser();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isLoading ? <h1>Loading...</h1> : children}
    </UserContext.Provider>
  );
};

const useUserValue = () => useContext(UserContext);

export { UserContext, UserProvider, useUserValue };
