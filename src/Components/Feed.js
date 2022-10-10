import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { database } from '../firebase';
import UploadFile from './UploadFile';
import Posts from './Posts'
import Navbar from './Navbar';

function Feed() {

    //Idhar user hume AuthContext wala mil rha hai, jo ki state changed hone pey change ho jata
    const {user, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState('')

    //fetching the users data from  firestore database on the basis of uid and passing as a props to UploadFile
    useEffect(() => {

        //idhar humlog database mey store user ka data bhejenge
        const unsub = database.users.doc(user.uid).onSnapshot((snapshot) => {
            setUserData(snapshot.data())
            // console.log("UserData passed as props",snapshot.data())
        })
        return ()=>{unsub()}
    },[user])
    
    return (
        //Private Route applied to Feed so that only user logged in or signing up for the forst time could come in feed
        <>
        <Navbar userData= {userData}/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {/* <div className="comp" style={{ width: '50%' }}>
                <h1>Welcome to feed</h1>
                <button onClick={logout}> Log out</button>
            </div> */}
            {/* passing user props to UploadFile component */}
            <UploadFile user = {userData} />

            {/* posts mey userData isliye chahiye kyuki like,cmnt wala feature dalna hai */}
            <Posts userData = {userData}/>
        </div>
    </>
    )
}

export default Feed
