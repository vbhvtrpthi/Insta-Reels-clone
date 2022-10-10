import Comments from './Comments';
import './Posts.css'
import Like from './Like'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Like2 from './Like2'
import AddComment from './AddComment';
import React,{useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {database} from '../firebase'
import { CircularProgress } from '@mui/material';
import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
import './Profile.css'

function Profile() {
    const {id} = useParams();
    const [userData, setUserdata] = useState(null);
    const [posts, setPosts] = useState(null); 
    const [open, setOpen] = useState(false);
    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };


    useEffect(() =>{
        
        database.users.doc(id).onSnapshot((snap) => {
            setUserdata(snap.data());

            console.log(snap.data());
        })
    },[id]); // keep updating when the id gets changed

    useEffect(async()=>{

        if(userData != null){
        let parr = []
        for(let i = 0; i < userData.postIds.length; i++){
            let postData = await database.posts.doc(userData.postIds[i]).get();
            parr.push({...postData.data(), postId:postData.id});
        }
        setPosts(parr)
        }
    })


  return (
    <>
    {
             posts == null || userData == null ? <CircularProgress/>:
             <>
                <Navbar userData = {userData}/>
                <div className="spacer"></div>
                <div className='container'>
                   <div className='upper-part'>
                      <div className='profile-img'>
                          <img src={userData.ProfileUrl}/>
                      </div>
                      <div className='info'>
                          <Typography variant="h5">
                              Email : {userData.email}
                          </Typography>
                          <Typography variant="h6">
                              Posts : {userData.postIds.length}
                          </Typography>
                      </div>
                   </div>
                   <hr style={{marginTop:'3rem', marginBottom:'3rem'}}/>
                          <div className="profile-videos">
                              {
                                  posts.map((post, index) => (
                                      <React.Fragment key={index}>
                                          <div className="videos">
                                              <video muted="muted" onClick={() => handleClickOpen(post.pId)}>
                                                  <source src={post.pUrl} />
                                              </video>
                                              {/* modal in mui is known as dialog */}
                                              <Dialog
                                                  //Is ek dialog ko tabb open hona hai, jab open ki state equal ho post ki pid se(jis post ki bari hai kyuki hamne map laga rakha hai post pey)
                                                  open={open == post.pId}
                                                  // open = {open}
                                                  onClose={handleClose}
                                                  aria-labelledby="alert-dialog-title"
                                                  aria-describedby="alert-dialog-description"
                                                  fullWidth={true}
                                                  maxWidth='md'
                                              >
                                                  <div className="modal-container">
                                                      <div className="video-modal">
                                                          {/* Jise he khule video modal mey autoplay kr do or muted ho */}
                                                          <video autoPlay={true} muted="muted" controls>
                                                              <source src={post.pUrl} />
                                                          </video>
                                                      </div>

                                                      <div className="comment-modal">
                                                          <Card className="card1" style={{ padding: '1rem' }}>
                                                              <Comments postData={post} />
                                                          </Card>
                                                          <Card variant="outlined" className="card2">
                                                              <Typography style={{ padding: '0.4rem' }}>{post.likes.length == 0 ? '' : `Liked by ${post.likes.length} users`}</Typography>
                                                              <div style={{ display: 'flex' }}>
                                                                  {/* Like2 component for user liking in modal */}
                                                                  <Like2 postData={post} userData={userData} style={{ display: 'flex', justifyContent: 'center' }} />

                                                                  {/* AddComment component for adding comments */}
                                                                  <AddComment userData={userData} postData={post} />
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

                </div>

             </>
    }
    </>
  )
}

export default Profile