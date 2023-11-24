import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap, { Circ } from 'gsap';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export const RegisterComponent = () => {
  
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const auth = getAuth();

  async function registerUser(event: React.FormEvent) {
    event.preventDefault(); // Prevents the default form submission behavior

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      try {
        const response = await fetch("http://localhost:7007/api/user/create", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email
          })
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.log("An error occurred:", error);

      }

      console.log("Registered user:", userCredential.user);

      navigate('/login');

    } catch (error) {
      console.error("Error in user registration:", error);
      // Handle registration errors here (e.g., displaying a notification)
    }
  }

    return (
        <form className='loginForm' onSubmit={registerUser} >
        <h1 className='formH1'>Sign Up</h1>

        <div className="usernameDiv">
          <label htmlFor="usernameInput" data-placeholder='Username' className='username' >
            <input 
            type="text" 
            name="usernameInput" 
            id="usernameInput" 
            required
            onChange={(e) => {
              setName(e.target.value)
              if(e.target.value !== "") {

                gsap.to('html', {
                  "--offset3": "-75%",
                  duration: 0.05,
                  ease: Circ.easeInOut
              })
              }
            } }

            onFocus={(e) => {

              gsap.to('html', {
                  "--offset3": "-75%",
                  duration: 0.05,
                  ease: Circ.easeInOut
              })
            }}
            onBlur={(e) => {
             
              if(e.target.value === "") {

                gsap.to('html', {
                  "--offset3": "0%",
                  duration: 0.05,
                  ease: Circ.easeInOut
              })
              }
            }}
              />
          </label>
        </div>

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
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            } }
            onFocus={(e) => {

              gsap.to('html', {
                  "--offset2": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
            }}
            onBlur={(e) => {
             
              if(e.target.value === "") {

                gsap.to('html', {
                  "--offset2": "0%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            }}
             />
          </label>
        </div>
        <div className='alreadyContainer'>
            <h3>Already registered?</h3>
            <a href="/login">To Login</a>
        </div>  
        <input type="submit" className='loginSubmit' value="Register" />
      </form>
    );
     
  };
  