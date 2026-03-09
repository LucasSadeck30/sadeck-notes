import React, { Fragment } from "react";
import { Navbar, Container, Column } from 'rbx'
import logoImage from '../../assets/imagens/logo.png'
import '../../styles/header.scss'
import { Link } from "react-router-dom";

function Header() {

  return (
    <Fragment>
      <Navbar>
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img src={logoImage} />
            </Link>
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
          <Navbar.Menu id="navbar-menu">
            <Navbar.Segment as="div" className="navbar-item navbar-end" align="right">
              <Column.Group>
                <Column>
                  <Link to="/register" className="button is-white has-text-custom-purple">Register</Link>
                </Column>
                <Column>
                  <Link to="/login" className="button is-outlined is-custom-purple">Login</Link>
                </Column>
              </Column.Group>
            </Navbar.Segment>
          </Navbar.Menu>
        </Container>
      </Navbar>
    </Fragment>
  )

}
export default Header;