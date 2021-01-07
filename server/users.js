const users = [];

const addUser = ({ id,name,room}) => { 
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // checks for existing user
    const existingUser = users.find((user)=>user.room===room && user.name === name);
    if(existingUser){
        return{ error : 'Username is taken'};
    }
    //add new user
    const user = { id,name,room};

    users.push(user);
    return{user}
}
//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id ===id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id) => users.find((user)=> user.id ===id); 

const getUsersInRoom = (room) => users.filter((user)=>user.room===room);

module.exports={addUser,removeUser,getUser,getUsersInRoom};