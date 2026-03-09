import React, { Fragment, useEffect, useState } from "react";
import { Button, Field, Control, Input, Column, Label, Help } from "rbx";
import { useNavigate } from "react-router-dom";
import UsersServices from "../../services/users";

function UserPasswordChangeForm() {
 
   const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [error, setError] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();
 //console.log(name, email, password);
 console.log(`Ta entrando em o negócio, ele vem assim ${currentPassword}, ${newPassword}   }`);
 

 
    try {
    const body_user = { currentPassword: currentPassword, newPassword: newPassword }    
    await UsersServices.updateUserPassword(user.id,body_user)

    if(UsersServices){

       navigate("/login");
       }          

    } catch (error) {
     return  setError(true); 
    }  
 };



  useEffect(() => {

    
   
  }, [navigate]);





  return (
    <Fragment>
      <Column.Group centered>
        <form onSubmit={handleSubmit}>
          <Column size={12}>
            <Field>
              <Label size="small">Current Password:</Label>
              <Control>
                <Input 
                  as="input"
                  type="text"
                  name="currentPassword"
            
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  />
              </Control>
            </Field>
            
            <Field>
              <Label size="small">New Password:</Label>
              <Control>
                <Input 
                   as="input"
                  type="text" 
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                      Change Password
                    </Button>
                  </Column>
                </Column.Group>
              </Control>
            </Field>
            {error && <Help color="danger">Error updating user</Help>}
          </Column>
        </form>
      </Column.Group>
    </Fragment>
  );
}

export default UserPasswordChangeForm