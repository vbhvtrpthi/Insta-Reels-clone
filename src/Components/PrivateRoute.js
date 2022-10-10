//PrivateRoute for the feed component, we want it to be accessed only when a user is logged in or when it signs up for the first time
import React,{useContext} from 'react'
import { Redirect, Route } from 'react-router'
import {AuthContext} from '../Context/AuthContext'


//Feed pey tbhi aaye jb bnda logged in ho, ya signup karkey sidhe feed pey aaye, tho
//hume ek private route banana padefa
function PrivateRoute({component:Component, ...rest}) {
    const {user} = useContext(AuthContext);
    console.log("PrivateRoute User ",user);
    return (
        
        <Route {...rest} render={props =>{
           return user ? <Component {...props}/>:<Redirect to = "login"/>
           }}/>
    )
}

export default PrivateRoute
