import './App.css';
import React from 'react'
import Home from './components/Home';
import Navbar from './components/Navbar';
import Alert from './components/Alert';

export default function App() {
  return (
    <div>
      <Navbar />
      <Alert message="This is an amazing react product"/>
      <Home />
    </div>
  )
}

