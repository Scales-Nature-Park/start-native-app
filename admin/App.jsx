import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

const App = () => {
  const [screen, setScreen] = useState('Login');

  return (
    <>
      { 
        (screen == 'Dashboard') ? 
            <Dashboard setScreen={setScreen}/> : 
            <LoginForm setScreen={setScreen}/>
      }
    </>
  );
};

export default App;
