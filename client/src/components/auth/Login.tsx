import { useState } from "react";
import gsap, { Circ } from 'gsap';
import { getAuth, signInWithEmailAndPassword  } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

export const LoginComponent = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const auth = getAuth();
    
    async function loginUser(event: React.FormEvent) {
      event.preventDefault(); 

      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          console.log("Logged in user:", userCredential.user);

          navigate('/main');

      } catch (error) {
          console.error("Error logging in:", error);
      }
  }

  return (
    <form className='loginForm' onSubmit={loginUser} >
    <h1 className='formH1'>Log in</h1>

    <div className="emailDiv">
      <label htmlFor="emailInput" data-placeholder='Email' className='email'>
        <input
        type="email" 
        name="emailInput" 
        id="emailInput" 
        required
        onChange={(e) => {
          setEmail(e.target.value)

          if(e.target.value !== "") {

            gsap.to('html', {
              "--offset": "-75%",
              duration: 0.05,
              ease: Circ.easeInOut
          })
          }
        } }

        onFocus={(e) => {

          gsap.to('html', {
              "--offset": "-75%",
              duration: 0.05,
              ease: Circ.easeInOut
          })
        }}
        onBlur={(e) => {
         
          if(e.target.value === "") {

            gsap.to('html', {
              "--offset": "0%",
              duration: 0.05,
              ease: Circ.easeInOut
          })
          }
        }}

         />
      </label>
    </div>

    <div className="passwordDiv">
      <label htmlFor="passwordInput" data-placeholder='Password' className='password'>
        <input type="password" 
        name="passwordInput" 
        id="passwordInput" 
        required
        onChange={(e) => {
          setPassword(e.target.value)
          
          if(e.target.value !== "") {

            gsap.to('html', {
              "--offset2": "-75%",
              duration: 0.05,
              ease: Circ.easeInOut
          })
          }

        }}

        onFocus={(e) => {
          gsap.to('html', {
              "--offset2": "-75%",
              duration: 0.05,
              ease: Circ.easeInOut
          })
        }}
        onBlur={(e) => {
         
          if(e.target.value === "") {

            gsap.to('html', {
              "--offset2": "0%",
              duration: 0.05,
              ease: Circ.easeInOut
          })
          }
        }}
         />
      </label>
    </div>
    <div className='alreadyContainer'>
        <h3>No account yet?</h3>
        <a href="/register">To Register</a>
    </div>  
    <input type="submit" className='loginSubmit' value="Login" />
      
  </form>
  );
   
};
