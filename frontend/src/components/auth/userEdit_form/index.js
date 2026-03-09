import React, { Fragment, useEffect, useState } from "react";
import { Button, Field, Control, Input, Column, Label, Help } from "rbx";
import { useNavigate } from "react-router-dom";
import UsersServices from "../../services/users";

function UserEditForm() {
 
   const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);


// função criada para ser chamada logo no inicio da renderização da página, para pegar os valores iniciais do usuário e colocar nos inputs,
// se eu chamar apenas o user, e por exemplo o usuário clicar sem fazer nada, vai mandar tudo vazio para lá, porque nos estados ainda não teria
// nenhum valor atribuído, só que a senha vai ter seus valores depois, caso o usuário queira mudar a senha
  const initialUserValue = () =>{
    setName(user.name);
    setEmail(user.email);
  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
 //console.log(name, email, password);
 console.log(`Ta entrando em o negócio, ele vem assim ${name}, ${email}   }`);
 

 
    try {
    const body_user = { name: name, email: email }    
    await UsersServices.updateUser(user.id,body_user)
   // console.log(`O valor de user é ${user}`);
    
       navigate("/notes");
        
      
    } catch (error) {
     return  setError(true); 
    }  
 };



  useEffect(() => {

     initialUserValue()
   
  }, [navigate]);





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
              <Control>
                <Column.Group breakpoint="mobile">
                  
                  <Column>
                    <Button 
                       as="button"
                      color="custom-purple" 
                      outlined
                      type="submit"
                    >
                      Update User
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

export default UserEditForm