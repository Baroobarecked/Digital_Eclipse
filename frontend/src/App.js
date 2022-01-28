import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate, useParams, useMatch, useLocation } from 'react-router-dom';
import SignUp from './components/UserPages/Signup';
import Login from './components/UserPages/Login';
import AddAlbum from './components/AlbumsPage/addnew';
import Navbar from './components/Navbar';
import UserModal from './components/UserPages/usermodal';
import Albums from './components/AlbumsPage/main';
import SongForm from './components/SongsPage/addsongform'
import { authenticate } from './store/session';
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

  function ValidateRoute() {
    let params = useParams()
    let location = useLocation();
    let songRoute = location.pathname.match(/^\/albums\/.*\/songs$/)
    let albumRoute = useMatch('/albums/*')
    let forumRoute = useMatch('/community/*')
    console.log(songRoute, location)
    if(songRoute) {
      let valid = params.albumId.match(/\d+/)
      if(valid) {
        return <SongForm />
      } else {
        return <Navigate to='/albums' replace />
      }
    } else if(albumRoute) {
      let valid = params.albumId.match(/\d+/)
      if(valid) {
        return <AddAlbum />
      } else {
        return <Navigate to='/albums' replace />
      }
    } else if(forumRoute) {
      let valid = params.forumid.match(/\d+/)
      if(valid) {
        return <Posts />
      } else {
        return <Navigate to='/community' replace />
      }
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<UserModal />}>
          <Route index element={<SplashPage />} />
          <Route exact path='signup' element={<SignUp />} />
          <Route exact path='login' element={<Login />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Route>
        <Route exact path='albums' element={<Albums />}>
          <Route exact path='addalbum' element={<AddAlbum />} />
          <Route exact path=':albumId' element={<ValidateRoute />} />
          <Route exact path=':albumId/songs' element={<ValidateRoute />} />
          <Route path='*' element={<Navigate to='' replace />} />  
        </Route>
        <Route exact path='community' element={<Albums />}>
          <Route path='' element={<ForumPage />}>
            <Route path=':forumid/:forumtitle' element={<ValidateRoute />} >
            </Route>
          </Route>
          <Route exact path='addforumdisscussion' element={<CreateForum />} />
          <Route path='*' element={<Navigate to='' replace />} />
        </Route>
        <Route exact path='vr/albums' element={<VrMain />}>
        <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
