import { getAuth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, updateProfile} from "firebase/auth";
import "./App.css";
import initializeAuthentication from "./Firebase/Firebase.initialize";
import {useState} from 'react'

initializeAuthentication();

const googleProvider = new GoogleAuthProvider();
// const createUserEmailPass = new CreateUserWithEmailAndPassword()

function App() {
const [userName, setName] = useState('')
const [email, setEmail] = useState('')
const [pass, setPass] = useState('')
const [error, setError] = useState('')
const [isLogin, setIsLogin] = useState(false)



  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log(user);
    });
  };
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePassChange= e => {
    setPass(e.target.value)
  }
  const toggleLogin= e => {
    setIsLogin(e.target.checked)
  }
  const handleRegistration = (e) => {
    e.preventDefault();
    if(pass.length < 6){
      return;
    }
    if (!/(?=.*[A-Z])/.test(pass)){
      setError("password must have 1 uppercase letter");
      return;
  }
     if(isLogin) {
       processLogin(email, pass)
     }
     else {
       registerNewUser(email, pass);
     }
    // createUserWithEmailAndPassword(auth, email, pass)
    // .then((result) => {
    //   const user = result.user;
    //   console.log(user);
    //   setError(' ');
    // })
    // .catch(error => {
    //   setError(error.message)
    // })
    // console.log(email, pass)
  };
  const processLogin = (email, pass) => {
         signInWithEmailAndPassword(auth, email, pass)
         .then(result=> {
           const user = result.user;
           console.log(user);
         })
         .catch(error => {
           setError(error.message);
         })
  }
 
  const registerNewUser = (email, pass) => {
    createUserWithEmailAndPassword(auth, email, pass)
    .then((result) => {
      const user = result.user;
      console.log(user);
      setError(' ');
      verifyEmail();
      setUserName();
    })
    .catch(error => {
      setError(error.message)
    })
  }
  
  const setUserName = () => {
    updateProfile(auth.currentUser, {displayName: userName})
    .then(result=> {
    })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(result=> {
      console.log(result)
    })
  }

  const handleResetPass = () => {
     sendPasswordResetEmail(auth, email)
     .then(result => {
     })
  }

  const handleName = e =>{
        setName(e.target.value)
  }
  return (
    <div className="mx-5">
      <h2 className="text-primary">Please {isLogin ? 'Login' :'Register'}</h2>
      <br></br>
      <br></br>
      <form onSubmit={handleRegistration}>
        {
          !isLogin && <div className="col-12">
          <label htmlFor="inputAddress" className="form-label">Name</label>
          <input type="text" onBlur={handleName} className="form-control" placeholder="your Name"/>
        </div>
        }
        {
          isLogin && <h1>{userName}</h1>
        }
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            onBlur={handleEmailChange}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            onBlur={handlePassChange}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div className="mb-3 form-check">
          <input onChange={toggleLogin} type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Already Register ?
          </label>
        </div>
        <div>
          <h3>{error}</h3>
        </div>
        <button type="submit" className="btn btn-primary">
        {isLogin ? 'Login' :'Register'}
        </button>
        <button type="button" onClick={handleResetPass} className="btn m-2 btn-primary">Reset Password</button>

      </form>
      {/* <button onClick={handleGoogleSignIn}>Google SignIn</button> */}
    </div>
  );
}

export default App;
