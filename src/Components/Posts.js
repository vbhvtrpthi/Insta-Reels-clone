import React, { useState, useEffect } from 'react'
import { database } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Video from './Video'
import './Posts.css'
import Like from './Like'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {  CardActionArea, CardActions } from '@mui/material';
import Like2 from './Like2'
import AddComment from './AddComment';
import Comments from './Comments';

function Post({ userData }) {
    //posts for storing all the posts available to display in feed
    const [posts, setPosts] = useState(null);
     
    //open is used to check whether to open modal or not
    const [open, setOpen] = useState(false);
    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };

    useEffect(() => {
        let parr = [] //postarr

        //onSnapShot post data pey ek event listener laga dega jo chlega jb posts update hui hgi
        const unsub = database.posts.orderBy('createdAt', 'asc').onSnapshot((querySnapshot) => {
            parr = []
            querySnapshot.forEach((doc) => {
                let data = { ...doc.data(), postId: doc.id }
                // let data = { ...doc.data()}
                console.log("Posts data",data);
                parr.push(data)
            })
            setPosts(parr);
        })
        return unsub
    }, [])
    return (
        <div>
            {  
            // userData props sey aa raha hai, tbhi null hoga jb user logged in na ho
                posts == null || userData == null ? <CircularProgress /> :
                    <div className="video-container">
                        {
                            posts.map((post, index) => (
                                <React.Fragment key={index}>
                                    <div className="videos">
                                        <Video src = {post.pUrl} />
                                        {/* Here we have used 'avatar' from material ui for users profile pic  */}
                                        <div className="fa" style={{ display: 'flex' }}>
                                            <Avatar src={userData.ProfileUrl} />&nbsp;&nbsp;
                                            <h4>{userData.fullname}</h4>
                                        </div>

                                      <Like userData={userData} postData={post}/>

                                        <ChatBubbleIcon className="chat-styling" onClick={()=>handleClickOpen(post.pId)}/>

                                        {/* modal in mui is known as dialog */}
                                        <Dialog
                                           //Is ek dialog ko tabb open hona hai, jab open ki state equal ho post ki pid se(jis post ki bari hai kyuki hamne map laga rakha hai post pey)
                                            open = {open == post.pId}
                                            // open = {open}
                                            onClose = {handleClose}
                                            aria-labelledby = "alert-dialog-title"
                                            aria-describedby = "alert-dialog-description"
                                            fullWidth = {true}
                                            maxWidth = 'md'
                                        >
                                        <div className="modal-container">
                                            <div className="video-modal">
                                                  {/* Jise he khule video modal mey autoplay kr do or muted ho */}
                                                   <video autoPlay={true} muted="muted" controls>
                                                       <source src={post.pUrl}/>
                                                   </video>                                            
                                            </div>

                                            <div className="comment-modal">
                                                    <Card className="card1" style={{padding:'1rem'}}>
                                                      <Comments postData = {post}/>
                                                    </Card>
                                                    <Card variant="outlined" className="card2">
                                                       <Typography style={{padding:'0.4rem'}}>{post.likes.length==0?'':`Liked by ${post.likes.length} users`}</Typography>
                                                       <div style={{display:'flex'}}>
                                                           {/* Like2 component for user liking in modal */}
                                                           <Like2 postData={post} userData={userData} style={{display:'flex',justifyContent:'center'}}/>

                                                           {/* AddComment component for adding comments */}
                                                            <AddComment userData={userData} postData={post}/>
                                                       </div>
                                                    </Card>
                                            </div>

                                        </div>
                                        </Dialog>

                                    </div>

                                </React.Fragment>
                            ))
                        }
                    </div>
            }

        </div>
    )
}

export default Post
