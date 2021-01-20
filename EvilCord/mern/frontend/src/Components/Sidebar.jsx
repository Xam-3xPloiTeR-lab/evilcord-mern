import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import SidebarChannel from './SidebarChannel';
import SignalCellularAltIcon from '@material-ui/icons/SignalCellularAlt';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CallIcon from '@material-ui/icons/Call';
import { Avatar, Button } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import HeadsetIcon from '@material-ui/icons/Headset';
import SettingsIcon from '@material-ui/icons/Settings';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import  db,{ auth} from './firebase';
import axios from './axios'
import Pusher from 'pusher-js'

const pusher = new Pusher('a92e0921af39228a0668', {
    cluster: 'ap2'
  });

function Sidebar() {
    const user = useSelector(selectUser);
    const [channels, setChannels] = useState([]);
    
    // useEffect (() =>{
    //     db.collection("channels").onSnapshot(snapshot =>
    //         setChannels(snapshot.docs.map(doc=> ({
    //             id: doc.id,
    //             channel: doc.data(),
    //         })))
    //     );
    // }, []);

    const getChannels = () =>{
        axios.get('/get/channelList').then((res)=>{
            console.log(res.data)
            setChannels(res.data)
        })
    }

    useEffect (() =>{
        getChannels()
        const channel = pusher.subscribe('channels');
        channel.bind('newChannel', function(data) {
        getChannels()
    });
    }, []);
    
const handleAddChannel = () => {
    const channelName = prompt("<Enter new channel name>");
    if(channelName){
        axios.post('/new/channel', {
            channelName: channelName
        })
        
    }

};

    return (
        <div className="sidebar">

         <div className="sidebar__top"> 
                <h3>Evilcord</h3>
                <ExpandMoreIcon/>
         </div> 

         <div className="sidebar__channel">
                <div className="sidebar__channelHeader">
                    <div className="sidebar__header">
                    <ExpandMoreIcon/>
                    <h4>Channel's List</h4>
                    </div>
                    <AddIcon onClick={handleAddChannel} className="sidebar__addChannel"/>
                </div>

                <div className="sidebar__channelList">
                    {channels.map(channel => (
                        <SidebarChannel key={channel.id} id={channel.id} channel={channel.name}/>
                    )
                    )}
                </div>
         </div>

         <div className="sidebar__voice">
             <SignalCellularAltIcon className="sidebar__voiceIcon" fontSize="large"/>
             <div className="sidebar__voiceInfo">
                 <h3>Voice disconnected</h3>
                 <p>Stream</p>
             </div>

             <div className="sidebar__voiceIcon">
                 <InfoOutlinedIcon/>
                 <CallIcon/>
             </div>
         </div>

            <div className="sidebar__profile">
                <Avatar  src={user.photo} />

                <div className="sidebar__profileInfo">
                    <h3>{user.displayName}</h3>
                    <p>#{user.uid.substring(0,5)}</p>    
                </div>

                <div className="sidebar__profileIcon">
                    <MicIcon/>
                    <HeadsetIcon/>
                    <SettingsIcon/>
                </div>
                </div>
                <Button onClick={()=> auth.signOut()} ><span className="logout">Logout</span></Button>
            </div>
    )
}

export default Sidebar
