import React, { Fragment } from 'react';
import Header from '../../../src/components/header';
import { Column, Container, Section, Card, Title } from 'rbx';
import logoImage from '../../../src/assets/imagens/logo.png'
import '../../../src/styles/auth.scss'
import LostPasswordForm from '../../components/auth/lostPassword_form';


const LostPasswordScreen = () => (
  
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
                      <img src={logoImage} />
                    </Column>
                  </Column.Group>

                  <Column.Group>
                    <Column size={12}>
                      <Title size={6} className="has-text-grey has-text-centered">
                        Your notes on the cloud
                      </Title>
                    </Column>
                  </Column.Group>

                        <LostPasswordForm />
                </Section>

              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
       
      </Container>
    </Section>

  </Fragment>
);

export default LostPasswordScreen
