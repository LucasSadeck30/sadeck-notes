import React, { Fragment, useEffect, useState } from "react";
import { Button, Field, Control, Input, Column, Label, Help } from "rbx";
import { useNavigate } from "react-router-dom";
import UsersServices from "../../services/users";

function RegisterForm() {
 
   const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
 //console.log(name, email, password);
 console.log(`Ta entrando em o negócio, ele vem assim ${name}, ${email} ${password}`);
 
 
    try {
    const user = await UsersServices.register({ name: name, email: email, password: password })
   // console.log(`O valor de user é ${user}`);
    
      setRedirectToLogin(true);
      return user
    } catch (error) {
     return  setError(true); 
    }  
 };



  useEffect(() => {
    if (redirectToLogin) {
      navigate("/login");
    }
  }, [redirectToLogin, navigate]);





  return (
    <Fragment>
      <Column.Group centered>
        <form onSubmit={handleSubmit}>
          <Column size={12}>
            <Field>
              <Label size="small">Name:</Label>
              <Control>
                <Input 
                  as="input"
                  type="text"
                  name="name"
            
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  />
              </Control>
            </Field>
            
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
                    <a 
                     className="button is-white has-text-custom-purple"
                     onClick={() => setRedirectToLogin(true)} //
                    >
                      Login or
                    </a>
                  </Column>
                  <Column>
                    <Button 
                       as="button"
                      color="custom-purple" 
                      outlined
                      type="submit"
                    >
                      Register
                    </Button>
                  </Column>
                </Column.Group>
              </Control>
            </Field>
            {error && <Help color="danger">Error registering user</Help>}
          </Column>
        </form>
      </Column.Group>
    </Fragment>
  );
}

export default RegisterForm;