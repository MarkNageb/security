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
import AddPatient from './AddPatient';





function App() {
  return (
    <BrowserRouter>
     <Routes>
     <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-patient" element={<AddPatient />} />
    </Routes>
</BrowserRouter>
  );
}

export default App;
