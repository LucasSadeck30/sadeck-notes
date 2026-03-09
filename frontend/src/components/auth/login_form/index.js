import React, { Fragment, useEffect, useState } from "react";
import { Button, Field, Control, Input, Column, Label, Help } from "rbx";
import { useNavigate } from "react-router-dom";
import UsersServices from "../../services/users";

function LoginForm() {
    
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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


  }, [redirectToRegister, redirectToNotes, navigate]);





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
            {error && <Help color="danger">Error email or password incorrect</Help>}
          </Column>
        </form>
      </Column.Group>
    </Fragment>
  );
}

export default LoginForm;