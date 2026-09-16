import { useEffect } from 'react';
import './App.css'
import FutsalBooking from './ftsl'
import { BrowserRouter } from 'react-router-dom'
import socket from "./socket"

function App() {

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <FutsalBooking />
      </BrowserRouter>
    </>
  )
}

export default App