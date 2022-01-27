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
import SplashPage from './components/UserPages/Splash';
import VrMain from './components/AlbumsPage/mainvr';
import CreateForum from './components/CommunityPages/CreateForum';
import ForumPage from './components/CommunityPages/Forum';
import Posts from './components/CommunityPages/Post';

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
          <Route index element={<SplashPage />} />
          <Route exact path='signup' element={<SignUp />} />
          <Route exact path='login' element={<Login />} />
        </Route>
        <Route exact path='albums' element={<Albums />}>
          <Route exact path='addalbum' element={<AddAlbum />} />
          <Route exact path=':albumId' element={<AddAlbum />} />
          <Route exact path=':albumId/songs' element={<SongForm />} />
        </Route>
        <Route exact path='community' element={<Albums />}>
            <Route path='' element={<ForumPage />}>
              <Route path=':forumid' element={<Posts />} >
              </Route>
            </Route>
          <Route exact path='addforumdisscussion' element={<CreateForum />} />
        </Route>
        <Route exact path='vr/albums' element={<VrMain />}>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
