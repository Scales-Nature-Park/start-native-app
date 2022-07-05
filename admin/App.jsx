import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
// import DataInput from './components/DataInput';

const App = () => {
  const [screen, setScreen] = useState({val: 'Login', params: {}});

  return (
    <>
      { 
        (screen.val == 'Dashboard') ? 
        <Dashboard params={screen.params} setScreen={setScreen}/> : 
        // (screen.val == 'DataEntry') ?
        //     <DataInput params={screen.params} setScreen={setScreen} /> :
            <LoginForm params={screen.params} setScreen={setScreen}/>
      }
    </>
  );
};

export default App;
