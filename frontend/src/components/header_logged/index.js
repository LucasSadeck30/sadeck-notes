import React, { Fragment, useEffect, useState } from 'react';
import { Navbar, Container, Column, Button, Dropdown } from 'rbx';
import logoImage from '../../assets/imagens/logo-white.png'
import "../../styles/header.scss";
import UsersService from '../services/users';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'



function HeaderLogged(props) {
  const [redirectToHome, setRedirectToHome] = useState(false);

  //redirectedToPasswordChange
  const user = JSON.parse(localStorage.getItem("user"));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // chama o useLocation
  const location = useLocation()

  // verifica se o caminho é users/edit, se for renderiza uma tela, se não for, renderiza a outra
  const identifyLocation = location.pathname === "/users/edit"

  const navigate = useNavigate();

  async function handleDeleteAccount ()  {
    // Aqui você coloca a lógica para deletar a conta
    console.log('Conta deletada!');
    setShowDeleteModal(false);
    console.log(`O valor que vem do id do usuário é ${user.id}`);
    await UsersService.deleteUser(user.id);
    setRedirectToHome(true);
    navigate("/")
    
  };

   const DeleteModal = () => (
    showDeleteModal && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            marginBottom: '15px', 
            color: '#363636',
            fontSize: '24px'
          }}>
            Confirmar Deleção de Conta
          </h2>
          
          <p style={{ 
            marginBottom: '25px', 
            color: '#4a4a4a',
            lineHeight: '1.5'
          }}>
            Tem certeza que deseja deletar sua conta permanentemente? 
            <br/><br/>
            <strong>Esta ação não pode ser desfeita!</strong> Todas as suas notas e dados serão perdidos.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'flex-end' 
          }}>
            <Button 
              color="light"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            
            <Button 
              color="danger"
              onClick={handleDeleteAccount}
            >
              Deletar Conta
            </Button>
          </div>
        </div>
      </div>
    )
  );





const redirectedToBack = (e) => {
  e.preventDefault();
 navigate("/notes")
}


const redirectedToEdit = (e) => {
   e.preventDefault();
 navigate("/users/edit")
   
}

const redirectedToPasswordChange = (e) => {
   e.preventDefault();
 navigate("/users/changePassword")
   
}



  const logOut = async () => {
    await UsersService.logout();
    setRedirectToHome(true);
  }

  if (redirectToHome == true)
    navigate("/");




if(!identifyLocation){
 return (
  <Fragment>   
    <Navbar color="custom-purple" className="navbar-logged">
      <Navbar.Brand>
        <Column.Group>
          <Column size="11" offset="1">
            <Link to="/notes">
              <img src={logoImage} />
            </Link>
          </Column>
        </Column.Group>

 <Navbar.Burger
   className="navbar-burger burger" 
   aria-label="menu" 
   aria-expanded="false" 
   data-target="navbar-menu">
   <span aria-hidden="true"></span>
   <span aria-hidden="true"></span>
   <span aria-hidden="true"></span>
 </Navbar.Burger>
      </Navbar.Brand>
      <Navbar.Menu>        
        <Navbar.Segment as="div" className="navbar-item navbar-end" align="right">
       <Navbar.Item as="div">
  <Button 
      className="open-button" 
      color="white" 
      outlined
      onClick={() => props.setIsOpen(true)}>
          <FontAwesomeIcon icon={faList} />
      </Button> 
     

            <Dropdown>
              <Dropdown.Trigger>
                <Button className="button" color="white" outlined>
                  <span>{user.name}▼</span>
                </Button>
              </Dropdown.Trigger>

              <Dropdown.Menu>
                <Dropdown.Content>
                  <Dropdown.Item as="div">

                      <a  onClick={redirectedToEdit}                                 
                    >UserEdit</a>
                    
                  </Dropdown.Item>
            
                  <Dropdown.Divider />
                   <Dropdown.Item as="div">

                      <a  onClick={redirectedToPasswordChange}                                 
                    >ChangePassword</a>
                    
                  </Dropdown.Item>

                  <Dropdown.Divider />
                      
                      <Dropdown.Item as="div">
                        {/* AQUI ESTÁ A CORREÇÃO */}
                        <a 
                          onClick={(e) => {
                            e.preventDefault();
                            setShowDeleteModal(true);
                          }}
                          style={{ color: '#f14668' }}
                        >
                          Delete Account
                        </a>
                      </Dropdown.Item>

                      <Dropdown.Divider />

                  
                  <Dropdown.Divider />
                  <Dropdown.Item as="div">
                    <a href="/" onClick={e => {
                      logOut();
                          }

                    }>LogOut</a>
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Menu>
            </Dropdown>


          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
<DeleteModal />  
  </Fragment>
  )


}else{
 return (
    <Navbar color="custom-purple" className="navbar-logged">
      <Navbar.Brand>
        <Column.Group>
          <Column size="11" offset="1">
            <Link to="/notes">
              <img src={logoImage} />
            </Link>
          </Column>
        </Column.Group>

 <Navbar.Burger
   className="navbar-burger burger" 
   aria-label="menu" 
   aria-expanded="false" 
   data-target="navbar-menu">
   <span aria-hidden="true"></span>
   <span aria-hidden="true"></span>
   <span aria-hidden="true"></span>
 </Navbar.Burger>


      </Navbar.Brand>
      <Navbar.Menu>
         
        <Navbar.Segment as="div" className="navbar-item navbar-end" align="right">
             
          <Navbar.Item as="div">
            <Dropdown>
              <Dropdown.Trigger>
                <Button className="button" color="white" outlined>
                  <span>{user.name}▼</span>
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Content>
                       <Dropdown.Item as="div">
                   <a onClick={(e)=>redirectedToBack(e)}                                 
                     >Voltar</a>

                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="div">
                    <a href="/" onClick={e => logOut()}>LogOut</a>
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Menu>
            </Dropdown>


          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
  )

}



 
}

export default HeaderLogged;