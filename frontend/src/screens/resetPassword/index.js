import React, { Fragment } from 'react';
import Header from '../../components/header';
import { Column, Container, Section, Card, Title } from 'rbx';
import logoImage from '../../assets/imagens/logo.png';
import '../../styles/auth.scss';
import ResetPasswordForm from '../../components/resetPassword_form';


const ResetPasswordScreen = () => (
  <Fragment>
    <Header />
    <Section size="medium" className="auth">
      <Container>
        <Column.Group centered>
          <Column size={3}>
            <Card>
              <Card.Content>
                <Section>
                  <Column.Group centered>
                    <Column size={12}>
                      <img src={logoImage} alt="Sadeck Notes Logo" />
                    </Column>
                  </Column.Group>

                  <Column.Group>
                    <Column size={12}>
                      <Title size={6} className="has-text-grey has-text-centered">
                        Create your new password
                      </Title>
                    </Column>
                  </Column.Group>

                  <ResetPasswordForm />
                </Section>
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  </Fragment>
);

export default ResetPasswordScreen;