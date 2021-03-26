import { useEffect, useState } from "react";
import axios from "axios";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      let token = localStorage.getItem("CC_Token");
      if (token) {
        try {
          let res = await axios.get("http://localhost:3001/auth/check-auth", {
            headers: {
              Authorization: `Basic ${token}`,
            },
          });
          if (res.data.authenication) {
            axios.defaults.headers.common["Authorization"] = `Basic ${token}`;
            setUser(res.data.user ?? null);
          }
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
        }
      }
      setIsLoading(false);
    };
    getCurrentUser();
  }, []);

  return {
    user,
    setUser,
    isLoading,
  };
};
