import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route } from 'react-router-dom';

//Importing Navbar
import Navbar from './components/Navbar';

//Importing Screens

import Home from './screens/Home'
import Map from './screens/Map';
import Announcement from './screens/Announcement'
import Connect from './screens/Connect';
import Help from './screens/Help';
import ImportantInfo from './screens/ImportantInfo';
import SignIn from './screens/SignIn';
import { AuthContextProvider } from './context/AuthContext';


class App extends React.Component {
  render() {
    return (
      <div className="body">
        <AuthContextProvider>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/announcement" element={<Announcement />} />
              <Route path="/connect" element={<Connect />} />     
              <Route path="/help" element={<Help />} /> 
              <Route path="/importantinfo" element={<ImportantInfo />} /> 
              <Route path="/signin" element={<SignIn />} /> 
            </Routes>
          </AuthContextProvider>
      </div>
    );
  }
}

export default App;
