import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/UserPages/Signup';
import Login from './components/UserPages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
