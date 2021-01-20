import React, {useEffect} from 'react';
import {useSelector ,useDispatch} from 'react-redux';
import {selectUser} from './features/userSlice';
import './App.css';
import Sidebar from './Components/Sidebar';
import Chat from './Components/Chat'
import Login from './Login';
import {auth} from './Components/firebase';
import {login,logout} from './features/userSlice';
function App() {
  const user = useSelector(selectUser);

  const dispatch = useDispatch(selectUser);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if(authUser){
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName,
        }))
      }else{
        dispatch(logout());
      }
    });
  }, [dispatch])
  return (
    <div className="app">
      {user==null ? (
        <Login/>
        
      ):(
        <>
        <Sidebar />
        <Chat />
        </>
      )
      }
      
    </div>
  );
}

export default App;
