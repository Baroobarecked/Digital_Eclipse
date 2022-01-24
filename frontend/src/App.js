import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/UserPages/Signup';
import Login from './components/UserPages/Login';
import AddAlbum from './components/AlbumsPage/addnew';
import Navbar from './components/Navbar';
import UserModal from './components/UserPages/usermodal';
import Albums from './components/AlbumsPage/main';
import SongForm from './components/SongsPage/addsongform'
import { authenticate } from './store/session';
import Logout from './components/UserPages/Logout';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<UserModal />}>
          <Route index element={<Navbar />} />
          <Route exact path='signup' element={<SignUp />} />
          <Route exact path='login' element={<Login />} />
        </Route>
          {/* <Route index element={<Navbar />} />
        </Route> */}
        <Route exact path='albums' element={<Albums />}>
          <Route index element={<Navbar />} />
          <Route exact path='addalbum' element={<AddAlbum />} />
          <Route exact path=':albumId' element={<AddAlbum />} />
          <Route exact path=':albumId/songs' element={<SongForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
