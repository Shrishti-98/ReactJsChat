import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/input';

let socket;
const Chat = ({location}) => { 
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message,setMessage] = useState('');  // the msg user will type
    const [messages,setMessages] = useState([]); // all the msgs
    const ENDPOINT = 'localhost:5000';

// run some additional code after React has updated the DOM
    useEffect(()=>{
        const {name,room}= queryString.parse(location.search);  // to retrieve the data user had entered 
        //location.search will not give the full url but only the parameters
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
// sending message from client to server "join" and passing paramters "name and room" 
// server will recognise the message name on its end.
        socket.emit('join',{name,room},(error)=>{
            if(error){
                alert(error);
            }
           
        });

    }, [ENDPOINT,location.search]); // // to specify when our useEffect function is being called..pass an array 
   //if present ,effect will only activate when the list change.
    
    useEffect(()=>{ // so that user will be able to see all the messages
        socket.on('message',(message)=>{
            setMessages([...messages,message]);

        });

        socket.on("roomData",({users})=>{
            setUsers(users);
        });
    },[messages]);

    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault(); //to prevent from refreshing the page on keypress
        if(message){
            //clears the inputbox of message after enter key is pressed.
            socket.emit('sendMessage',message,()=>setMessage('')); 
        }
    }

 
    return(
        <div className="outerContainer">
            <div className="container">
              <InfoBar room={room}/>
              <Messages messages={messages} name={name}/>
              <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>

            </div>
           
        </div>
    );
}

export default Chat;