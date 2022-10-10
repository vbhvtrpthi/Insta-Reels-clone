import { React, useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { makeStyles } from '@material-ui/styles'; //for designing material ui component
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import './Signup.css';
import insta from '../Assets/Instagram.JPG'; //importing insta logo
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; //For cloud icon from the upload image btn
import { Link, useHistory } from 'react-router-dom';
import { height } from '@mui/system';
import { AuthContext } from '../Context/AuthContext'; // for getting signup function
import { database, storage } from '../firebase';

//Card component taken from material UI
export default function Signup() {
    const useStyles = makeStyles({
        text1: {
            color: 'grey',
            textAlign: 'center'
        },
        card2: {
            height: '8vh',
            marginTop: '2%'
        }
    })
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState(null); //profile pic
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory(); //The useHistory hook gives you access to the history instance that you may use to navigate. (we get useHistory from react-router-dom)
    const { signup } = useContext(AuthContext); // for gettinf signup from context API
    // console.log("singup",signup)

    const handleClick = async () => {
        //clicking on signup w/o uploading profile pic
        if (file == null) {
            setError("Please upload profile image first");
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }

        try {
            setError('')
            setLoading(true) //for enabling signup button
            let userObj = await signup(email, password); //signUp function coming from AuthContext 
            // console.log("Signup Userobj",userObj);
            let uid = userObj.user.uid;

            //For storing images
                const uploadTask = storage.ref(`/data/${uid}/ProfileImage`).put(file);
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
                        //for storing in the firestore database
                        database.users.doc(uid).set({
                            email:email,
                            userId:uid,
                            fullname:name,
                            ProfileUrl:url,
                            createdAt:database.getTimeStamp()
                        })
                    })
                    setLoading(false);
                    history.push('/');//Once the signup is completed navigate to / url
                }
            }
            catch (err) {
                setError(err);
                setTimeout(() => {
                    setError('')
                }, 2000)
            }
        }

    return (
        <div className="signupWrapper">
            <div className="signupCard">
                {/* for border used variant="outlined" */}
                <Card variant="outlined" style={{ height: '85vh' }}>
                    <div className="insta-logo">
                        <img src={insta} alt="" />
                    </div>
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            Sign up to see photos and videos from your friends
                        </Typography>

                        {/* alert taken from mui */}
                        {error != '' && <Alert severity="error">{error}</Alert>}

                        {/* for input we use textfield in mui */}
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin="dense" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} margin="dense" size="small" value={password} onChange={(e) => setPassword(e.target.value)} />
                        
                        <TextField id="outlined-basic" label="Full Name" variant="outlined" fullWidth={true} margin="dense" size="small"
                            value={name} onChange={(e) => setName(e.target.value)} />

                        {/* component= label sey hum kahi bhi click karege tho img upload hogi */}
                        <Button color="secondary" fullWidth={true} variant="outlined" margin="dense" startIcon={< CloudUploadIcon />} component="label">
                            Upload Profile Image
                            <input type="file" accept="images/*" hidden onChange={(e) => setFile(e.target.files[0])} />
                        </Button>
                    </CardContent>

                    <CardActions>
                          {/* Button is disabled (false) at the time of loading */}
                        <Button color="primary" fullWidth={true} variant="contained" disabled={loading} onClick={handleClick}>
                            Sign up 
                        </Button>
                    </CardActions>

                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            By signing up,you agree to our Terms, Data Policy and Cookies Policy.
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined" className={classes.card2} >
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            Having an account ? <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
