   import React, { Fragment } from 'react';
import HeaderLogged from '../../../components/header_logged';
import UserEditForm from '../../../components/auth/userEdit_form';
import '../../../styles/notes.scss'

    const UserEditScreen = () => (
      <Fragment>
    <HeaderLogged/>
    <UserEditForm/>
      </Fragment>
    );

    export default UserEditScreen;
