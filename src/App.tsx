import './App.css'
import Login from '@/pages/login.pages';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignUp } from '@/pages';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App;