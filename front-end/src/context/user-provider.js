import { useContext, createContext } from "react";
import { useUser } from "../hooks/useUser";
import { LoadingPage } from "../pages/LoadingPage";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { user, setUser, isLoading } = useUser();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isLoading ? <LoadingPage /> : children}
    </UserContext.Provider>
  );
};

const useUserValue = () => useContext(UserContext);

export { UserContext, UserProvider, useUserValue };
