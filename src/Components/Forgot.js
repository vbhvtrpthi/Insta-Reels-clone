import * as React from 'react';
import { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { makeStyles } from '@material-ui/styles'; //for designing material ui component
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import './Login.css';
import insta from '../Assets/Instagram.JPG'; //importing insta logo
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link, useHistory } from 'react-router-dom';
import bg from '../Assets/insta.png' // for slider image
import { height } from '@mui/system';
import img1 from '../Assets/img1.jpg';
import img2 from '../Assets/img2.jpg';
import img3 from '../Assets/img3.jpg';
import img4 from '../Assets/img4.jpg';
import img5 from '../Assets/img5.jpg';
import { AuthContext } from '../Context/AuthContext';

//Card component taken from material UI
export default function Forgot() {
    const store = useContext(AuthContext);
    console.log(store);
    const useStyles = makeStyles({
        text1: {
            color: 'grey',
            textAlign: 'center'
        },
        text2: {
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { forgot } = useContext(AuthContext);

    const handleClick = async () => {

        try {
            setError('');
            setLoading(true);
            let res = await forgot(email);
            setLoading(false);
            history.push('/');
        } catch (err) {
            setError(err);
            setTimeout(() => {
                setError('')
            }, 2000);
            setLoading(false);
        }
    }


    return (
        <div className="loginWrapper">

            <div className="imgcar" style={{ backgroundImage: 'url(' + bg + ')', backgroundSize: 'cover' }}>
                {/* pure-react-carousel for the left hand side slider  */}
                <div className="car">
                    <CarouselProvider
                        visibleSlides={1}
                        totalSlides={5}
                        naturalSlideWidth={238}
                        naturalSlideHeight={423}
                        hasMasterSpinner
                        isPlaying={true}
                        infinite={true}
                        dragEnabled={false}
                        touchEnabled={false}
                    >
                        <Slider>
                            <Slide index={0}><Image src={img1} /></Slide>
                            <Slide index={1}><Image src={img2} /></Slide>
                            <Slide index={2}><Image src={img3} /></Slide>
                            <Slide index={3}><Image src={img4} /></Slide>
                            <Slide index={4}><Image src={img5} /></Slide>
                        </Slider>
                    </CarouselProvider>
                </div>
            </div>

            <div className="loginCard">
                {/* for border used variant="outlined" */}
                <Card variant="outlined" F>
                    <div className="insta-logo">
                        <img src={insta} alt="" />
                    </div>
                    <CardContent>

                        {/* alert taken from mui */}
                        {<Alert severity="error">Enter your email and we'll send you a link to get back into your account</Alert>}

                        {/* for input we use textfield in mui */}
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin="dense" size="small"
                            value={email} onChange={(e) => setEmail(e.target.value)} />

                    </CardContent>
                    <CardActions>
                        <Button color="primary" fullWidth={true} variant="contained" onClick={handleClick} disabled={loading}>
                         Send Login Link
                        </Button>
                    </CardActions>
                </Card>

                <Card variant="outlined" className={classes.card2} >
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            Don't have an account ? <Link to="/signup" style={{ textDecoration: 'none' }}>Signup</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
