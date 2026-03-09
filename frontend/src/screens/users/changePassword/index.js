   import React, { Fragment } from 'react';
import '../../../styles/notes.scss'
import HeaderLogged from '../../../components/header_logged';
import UserPasswordChangeForm from '../../../components/auth/user_passwordChange_form';

 const UserPasswordChangeScreen = () => (
      <Fragment>
    <HeaderLogged/>
    <UserPasswordChangeForm/>
      </Fragment>
    );

    export default UserPasswordChangeScreen;
