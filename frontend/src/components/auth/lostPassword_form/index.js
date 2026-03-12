import React, { Fragment, useEffect, useState } from "react";
import { Field, Control, Input,Button, Column, Label, Help } from "rbx";
import UsersService from "../../services/users";


function LostPasswordForm() {
    
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

 console.log(`Ta entrando em o negócio nessa senha perdida, ele vem assim  ${email}`);
  
    try {
    const user = await UsersService.lostPassword({ email: email})
    //console.log(`O valor de user é ${user}`);
            return user
    } catch (error) {
     return  setError(true); 
    }  

 };

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

                                   <Column>
                                  <Button 
                                     as="button"
                                    color="custom-purple" 
                                    outlined
                                    type="submit"
                                  >
                               Send
                                  </Button>
                                </Column>
                     </Field>
            {error && <Help color="danger">Error email or password incorrect</Help>}
          </Column>
        </form>
      </Column.Group>
    </Fragment>
  );
}

export default  LostPasswordForm