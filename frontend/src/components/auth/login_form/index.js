import React, { Fragment, useEffect, useState } from "react";
import { Button, Field, Control, Input, Column, Label, Help } from "rbx";
import { Link, useNavigate } from "react-router-dom";
import UsersServices from "../../services/users";

function LoginForm() {
    
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToPasswordLostScreen, setRedirectToPasswordLostScreen] = useState(false);
  const [redirectToRegister, setRedirectToRegister] = useState(false);
  const [redirectToNotes, setRedirectToNotes] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

 console.log(`Ta entrando em o negócio, ele vem assim  ${email} ${password}`);
 
 
    try {
    const user = await UsersServices.login({ email: email, password: password })
    console.log(`O valor de user é ${user}`);
    
      setRedirectToNotes(true);
      return user
    } catch (error) {
     return  setError(true); 
    }  
 };


  useEffect(() => {

    if (redirectToRegister) {
      navigate("/register");
    }

 if (redirectToNotes) {
      navigate("/notes");
    }

    
    if(redirectToPasswordLostScreen){
      console.log(`Entrou aqui`);
      
      navigate("/lostPassword");
    }


  }, [redirectToRegister, redirectToNotes,redirectToPasswordLostScreen, navigate]);





  return (
    <Fragment>
      <Column.Group centered>
        <form onSubmit={handleSubmit}>
          <Column size={12}>
                     
            <Field>
              <Label size="small">Email:</Label>
              <Control>
                <Input 
                   as="input"
                  type="email" 
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Control>
            </Field>  

            <Field>
              <Label size="small">Password:</Label>
              <Control>
                <Input 
                   as="input"
                  type="password" 
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Control>
            </Field> 
            
                       
            <Field>
              <Control>
                <Column.Group breakpoint="mobile">
                
                     <Column>
                    <Button 
                       as="button"
                      color="custom-purple" 
                      outlined
                      type="submit"
                    >
                     Login
                    </Button>
                  </Column>

                  <Column>
                    <a 
                     className="button is-white has-text-custom-purple"
                     onClick={() => setRedirectToRegister(true)} //
                    >
                     Register
                    </a>
                  </Column>
          
                  </Column.Group>
  </Control>
            </Field>
      <Field>
        
              <Control>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Link 
                    to="/lostPassword"
                    style={{ color: '#6B5CE7', fontSize: '14px' }}
                  >
                    Lost your Password?
                  </Link>
                </div>
              </Control>
            </Field>
            

           
            {error && <Help color="danger">Error email or password incorrect</Help>}
          </Column>
        </form>
      </Column.Group>
    </Fragment>
  );
}

export default LoginForm;