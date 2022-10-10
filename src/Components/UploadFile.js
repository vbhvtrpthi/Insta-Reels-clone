import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MovieIcon from '@material-ui/icons/Movie';
import LinearProgress from '@mui/material/LinearProgress';
import { v4 as uuidv4 } from 'uuid'
import { database, storage } from '../firebase';


function UploadFile(props) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); //loading for disabling button once upload is started

    const handleChange = async (file) => {
        if (file == null) {
            setError("Please select a file first");
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }
        //file size is in bytes so 1024 * 1024 will become mb's
        //condition to specify that do not upload the file if size is greater than 100mb,
        if (file.size / (1024 * 1024) > 100) {
            setError('This video is very big');
            setTimeout(() => {
                setError('')
            }, 2000);
            return;
        }

        //Install uuid ('npm i uuid') for providing unique uid automatically
        let uid = uuidv4();
        setLoading(true);
        const uploadTask = storage.ref(`/posts/${uid}/${file.name}`).put(file);
        uploadTask.on('state_changed', fn1, fn2, fn3);

        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`upload is ${progress} done`)
        }

        function fn2(error) {
            setError(error);
            setTimeout(() => {
                setError('')
            }, 2000)
            setLoading(false);
            return;
            console.log('error', error);
        }
        function fn3() {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                console.log(url);
                //
                let obj = {
                    likes: [],
                    comments: [],
                    pId: uid, //post id is unique id created using uuidv4(). 
                    pUrl: url, //post url whih we got after uploading
                    uName: props.user.fullname, //user name who have created post
                    uProfile: props.user.ProfileUrl, //Avatar aayga jo chota sa dibba tho usme use ki image bhi chye
                    userId: props.user.userId,
                    createdAt: database.getTimeStamp()
                }

                //Idhar hamne koi uid ni pass ki tho firebase automatically bana dega at the time saving
                database.posts.add(obj).then(async (ref) => {
                    //jo user humne signup mey banaya tha uskey andar usme jao or jis user ne posts upload ki hai uskey andar postId daal do.
                    let res = await database.users.doc(props.user.userId).update({
                        postIds: props.user.postIds != null ? [...props.user.postIds, ref.id] : [ref.id]
                    })
                }).then(() => {
                    //agar upar wala kaam yani signup mey jo banaya tha uskey andar post id daal gayi jo usne upload ki thi tho then me aa jayenge
                    setLoading(false);
                }).catch((err) => {
                    setError(err)
                    setTimeout(() => {
                        setError('')
                    }, 2000)
                    setLoading(false)
                })
            })
            setLoading(false);
        }
    }

    return (
        <div style={{marginTop:'5rem', marginBottom:'1rem'}}>
            {
                error != '' ? <Alert severity="error">{error}</Alert> :
                    <>

                        <input type="file" accept="video/*" onChange={(e) => handleChange(e.target.files[0])} id="upload-input" style={{ display: 'none' }} />
                        <label htmlFor="upload-input">
                            <Button
                                variant="outlined"
                                color="secondary"
                                disabled={loading}
                                component="span" // span dene sey button input key liye kaam krne lagega
                            >
                                <MovieIcon />&nbsp; UPLOAD VIDEO
                            </Button>
                        </label>

                        {loading && <LinearProgress color="secondary" style={{ marginTop: '3%' }} />}

                    </>
            }
        </div>
    )
}

export default UploadFile
