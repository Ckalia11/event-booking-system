import './App.css';
import Bookings from './pages/bookings';
import Events from './pages/events';
import Auth from './pages/auth';
import NavigationBar from './components/nav';
import AuthContext from './context/authContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [authInfo, setAuthInfo] = useState({
    token: null,
    userId: null,
    tokenExpiration: null,
  });

  const login = (token, userId, tokenExpiration) => {
    setAuthInfo({
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
    });
  };

  const logout = () => {
    setAuthInfo({
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          authInfo: authInfo,
          login: login,
          logout: logout,
        }}
      >
        <NavigationBar />
        <Routes>
          {!authInfo.token && (
            <Route path="/" element={<Navigate to="/auth" />} />
          )}
          {!authInfo.token && <Route path="/auth" element={<Auth />} />}
          {authInfo.token && (
            <Route path="/" element={<Navigate to="/events" />} />
          )}
          {authInfo.token && (
            <Route path="/auth" element={<Navigate to="/events" />} />
          )}
          <Route path="/events" element={<Events />} />
          {authInfo.token && <Route path="/bookings" element={<Bookings />} />}
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
