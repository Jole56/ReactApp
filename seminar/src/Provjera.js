import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";


const Provjera = () =>{
    const [users,setUsers] = useState([])
    const [admins,setAdmins] = useState([])
    const token = localStorage.getItem("token");
    if (!token){
        return ; 
    }

    navigate = useNavigate()
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

    useEffect(()=>{
        const fetchAdmins = async () => {
            const token = localStorage.getItem("token");
            try{
                const res = await fetch('http://localhost:3000/user/alladmins',{
                    method: 'GET',
                    headers: {  Authorization: `Bearer ${token}`}
        
                })
                const data = await res.json()
                setAdmins(data)
            }catch(err){
                console.error(err)
            }
            
        }
        fetchAdmins()        
    },[])
    

    handleUsers = () =>{
        navigate('/userspanel')
    }

    handleAdmins = () =>{
        navigate('/adminspanel')
    }
    return(
        <div>
            {users.length}
            <button onClick={handleUsers}>Users</button>
            {users.map((user) => (
                <p>user:{user.username}</p>
            ))}
            {admins.length}
            <button onClick={handleAdmins}>Admins</button>
            {admins.map((admin) => (
                <p>admin:{admin.username}</p>
            ))}
        </div>
        
    )

}



export default Provjera