import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ChakraProvider} from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
export default function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
