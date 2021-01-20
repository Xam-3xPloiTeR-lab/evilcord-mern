import React, { useEffect, useState } from 'react';
import './Chat.css';
import ChatHeader from './ChatHeader';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import GifIcon from '@material-ui/icons/Gif';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Message from './Message';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { selectChannelId, selectChannelName } from '../features/appSlice';
import axios from './axios';
import Pusher from 'pusher-js'

const pusher = new Pusher('a92e0921af39228a0668', {
    cluster: 'ap2'
  });

function Chat() {
    const user = useSelector(selectUser);
    const channelId = useSelector(selectChannelId);
    const channelName = useSelector(selectChannelName);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const getConversation = (channelId) => {
        if(channelId){
            axios.get(`/get/conversation?id=${channelId}`).then((res)=> {
                setMessages(res.data[0].conversation)
            })
        }
    }

    useEffect(()=>{
        getConversation(channelId)

        var channel = pusher.subscribe('conversation');
        channel.bind('newMessage', function(data) {
            getConversation(channelId)
        });

    }, [channelId]);

    const sendMessage = (e) => {
        e.preventDefault();

        axios.post(`/new/message?id=${channelId}`,{
            message: input,
            timestamp: Date.now(),
            user: user
        })
        setInput('');
        getConversation(channelId)

        var channel = pusher.subscribe('conversation');
        channel.bind('newMessage', function(data) {
            getConversation(channelId)
        });
    };
    
    

    return (
        <div className="chat">
            <ChatHeader channelName={channelName}/>

            <div className="chat__Messages">
                {messages.map((message)=>(
                    <Message timestamp={message.timestamp}
                    message={message.message}
                    user={message.user} />
                ))}
                
            </div>

            <div className="chat__input">
                <AddCircleIcon fontSize="large"/>
                <form>
                        <input disabled={!channelId} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message #${channelName}`}/>
                        <button onClick={sendMessage} className="chat__InputButton" type="submit">Send</button>
                    </form>
                <div className="chat__inputIcon">
                    <CardGiftcardIcon fontSize="large"/>
                    <GifIcon fontSize="large"/>
                    <EmojiEmotionsIcon fontSize="large"/>
                </div>
            </div>
        </div>
    )
}

export default Chat
