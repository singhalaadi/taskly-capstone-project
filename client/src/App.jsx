import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserProvider";
import PrivateRoute from "./components/PrivateRoute";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import SingleTask from "./pages/SingleTask";
import UpdateTask from "./pages/UpdateTask";
import Navbar from "./components/Navbar";
export default function App() {
  return (
    <UserProvider>
      <ChakraProvider>
        <BrowserRouter>
          <Navbar />
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/:id" element={<SingleTask />} />
              <Route path="/tasks/update/:id" element={<UpdateTask />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </UserProvider>
  );
}
