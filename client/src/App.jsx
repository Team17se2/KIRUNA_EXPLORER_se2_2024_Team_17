import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import { useState, useEffect } from 'react'
import AppContext from './AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Authentication';
import Default from './components/Default';
import Home from './components/Home';
import Document from './components/Document';
import AddDocument from './components/AddDocument';
import Documents from './components/Documents';
import API from './API';
import CreateDocument from './components/CreateDocument';
import ModifyDocument from './components/ModifyDocument';


function App() {
  // stato per tenere traccia dello stato di autenticazione dell'utente
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  // controllo se l'utente è loggato
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        setLoggedIn(false);
        setUser(undefined);
      }
    }
    checkAuth();
  }, []);
  
 
  function loginSuccessful(user) {
    setUser(user);
    setLoggedIn(true);
  }

  async function doLogout() {
    await API.logout();
    setLoggedIn(false);
    setUser(undefined);
  }
  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        loginState: {
          user: user,
          loggedIn: loggedIn,
          loginSuccessful: loginSuccessful,
          doLogout: doLogout
        }
      }}
      >
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/addDocument' element={<Document />} />
          <Route path='/documents' element={<Documents />} />
          <Route path='/documents/:documentId/addConnection' element={<AddDocument />} />
          {/* <Route path="/modify-document/:documentId" element={<ModifyDocument documents={documents} onUpdate={handleUpdate} />} /> */}
          <Route path='/documents/create-document' element={<CreateDocument/>} />
          <Route path='/*' element={<Default/>} />
          
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App
