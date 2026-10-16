import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    axios .get('http://localhost:8000/api/health/')
      .then((response)=> {
        setApiStatus(response.data.status);
      })
      .catch((error) => {
        setApiStatus('Error connecting to Django');
      });
  }, []);

  return (
    <div className="container py-5">
      <h1>Choovie</h1>
      <p>React frontend is running</p>
      <div className="alert alert-info">
       Django API Status: {apiStatus}
      </div>
    </div>
  );

}

export default App;