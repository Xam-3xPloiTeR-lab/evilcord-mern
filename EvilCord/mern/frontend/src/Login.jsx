import React from 'react';
import { Button } from '@material-ui/core';
import {auth,providor} from './Components/firebase'
import './Login.css';
function Login() {
    const login= () =>{
       auth.signInWithPopup(providor).catch((error) => alert(error.message));
    }
    return (
        <div className="login">

            <div className="login__logo">
                <img src="https://logo-logos.com/wp-content/uploads/2018/03/discord_icon_logo_remix.png" alt=""/>
            </div>
            
            <Button onClick={login}>Sign In</Button>
            <h3 className="msg">EvilCord By Xam-3xPloiTeR</h3>
        </div>
    )
}
export default Login
