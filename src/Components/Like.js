import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { database } from '../firebase';

function Like({ userData, postData }) {

    const [like, setLike] = useState(null);
    useEffect(() => {
        let check = postData.likes.includes(userData.userId) ? true : false
        setLike(check);
    }, [postData])//post data jb bhi change hga ye chalega(jb like ya dislike kareng)

    const handleLike=()=>{
        if(like == true){
            //WHen we unlike, below narr function will return all the userid's excluding ours.
            let narr = postData.likes.filter((el)=>el!=userData.userId)
            // console.log("likes narr",narr);
            database.posts.doc(postData.postId).update({
                likes:narr
            })
        }else{
            //when we like the shorts, then the likes get updated of the posts
            let narr = [...postData.likes,userData.userId]
            database.posts.doc(postData.postId).update({
                likes: narr
            })
        }
    }
    return (
        <div>
            {
                like != null ?
                    <>
                        {
                            like == true ? <FavoriteIcon className = {`icon-styling like`} onClick = {handleLike} /> : <FavoriteIcon className={`icon-styling unlike`} onClick={handleLike} />
                        }
                    </> :
                    <></>
            }
        </div>
    )
}

export default Like
