import { UserContext } from "./UserContext";
import { useLocalStorage } from "../utils/storage.js";

const UserProvider = (props) => {
  const [user, setUser] = useLocalStorage("taskly_user", null);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export default UserProvider;
