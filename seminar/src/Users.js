
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Users = () =>{
    const [users,setUsers] = useState([])
    
    useEffect(()=>{
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try{
                const res = await fetch('http://localhost:3000/user/allusers',{
                    method: 'GET',
                    headers: {  Authorization: `Bearer ${token}`}
        
                })
                const data = await res.json()
                setUsers(data)
            }catch(err){
                console.error(err)
            }
            
        }
        fetchUsers()        
    },[])

    return (
        <div>

            {users.map((user) => (
                <p>user:{user.username}</p>
            ))}
            </div>
    )
}


export default Users