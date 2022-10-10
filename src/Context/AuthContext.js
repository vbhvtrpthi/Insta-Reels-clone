import React,{useState,useEffect} from 'react';
import {auth} from '../firebase';
export const AuthContext= React.createContext(); //creating a Global store


//Here children are the components wrapped under AuthProvider in App.js
export function AuthProvider({children}){

    const [user,setUser] = useState();
    const [loading,setLoading] = useState(true);

    function signup(email,password){
      return auth.createUserWithEmailAndPassword(email,password);
    }
    function login(email,password){
      return auth.signInWithEmailAndPassword(email,password);
    }
    function logout(){
        auth.signOut();
    }

    //For sending the reset password link
    function forgot(email){
        auth.sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent!
                // ..
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    }

    useEffect(()=>{
     const unsub = auth.onAuthStateChanged((user)=>{
         setUser(user);
         setLoading(false);
     },[])

     //this function will execute at time of ComponentWillUnmount() ,before unmounting of a component
     return()=>{
         unsub();
     }

    })

    //In store object we write the namee of the function which we want to make it available to all the components
    const store={
        user,
        signup,
        login,
        logout,
        forgot
    }

    return(
        //passing the store value to all the childrens (Components) wrapped in the AuthProvider in App.js
        <AuthContext.Provider value={store}>
            {!loading && children}
            {/* <h2>Hella Welcome to the AuthContext</h2> */}
            {/* {console.log("AuthContext User",user)}
            {console.log("AuthContext Children",children)} */}
        </AuthContext.Provider>
    )

}