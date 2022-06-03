import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';
import { Route } from 'react-router-dom';
import Login from './Login';
import {BrowserRouter, Routes} from "react-router-dom"
import "./css/bootstrap.min.css"
import "./css/signin.css"
import "./css/style.css"
import { useEffect } from 'react';
import {Moralis} from 'moralis';





function App() {
  return (
    <BrowserRouter>
     <Routes>
     <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
</BrowserRouter>
  );
}

export default App;
