import React from 'react'
import './Video.css'
import ReactDOM from 'react-dom'

function Video(props) {

    // console.log("Video props ",props);
    const handleClick = (e)=>{
        //Tab dabane sey mute unmute karne key liye
        e.preventDefault();
        e.target.muted = !e.target.muted;
    }
    const handleScroll=(e)=>{
        //automatically scrolls to next video once video is cmpltd
       let next= ReactDOM.findDOMNode(e.target).parentNode.nextSibling
       if(next){
           next.scrollIntoView()
           e.target.muted=true
       }
    }
    return (
        // once the videos is ended "onEnded will be called"
        //muted so that by default muted rahe
        <video src={props.src} onEnded={handleScroll} className="videos-styling" muted="muted" onClick={handleClick} controls>

        </video>
    )
}

export default Video
