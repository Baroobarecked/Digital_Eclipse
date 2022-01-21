import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/UserPages/Signup';
import Login from './components/UserPages/Login';
import AddAlbum from './components/AlbumsPage/addnew';
import Navbar from './components/Navbar';
import UserModal from './components/UserPages/usermodal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<UserModal />}>
          <Route exact path='signup' element={<SignUp />} />
          <Route exact path='login' element={<Login />} />
          <Route exact path='addalbum' element={<AddAlbum />} />
        </Route>
          {/* <Route index element={<Navbar />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
