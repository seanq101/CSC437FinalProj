import React, { Component } from 'react';
import {Register, SignIn,  ConfDialog, MyEntsOverview, 
   PubEntsOverview, BoardRoom} 
from '../components'
import {Route, Redirect, Switch } from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import './Main.css';

var ProtectedRoute = ({component: Cmp, path, ...rest }) => {
   return (<Route path={path} render={(props) => {
      return Object.keys(rest.Prss).length !== 0 ?
      <Cmp {...rest}/> : <Redirect to='/signin'/>;}}/>);
   };
   
class Main extends Component {
   
   signedIn() {
      return Object.keys(this.props.Prss).length !== 0; // Nonempty Prss obj
   }

   closeErrorConf = (btn) => {
      this.props.clearErrors();
   }

   render() {
      console.log("Redrawing main");
      return (
         <div>
            <div>
               <Navbar expand="md">
                  <Navbar.Toggle />
                  <Navbar.Collapse className="flex mr-auto">
                     <Nav variant="pills" className="justify-content-left">
                        {this.signedIn() ?
                           [
                              <LinkContainer to='/myEnts' key={-1}>
                                 <Nav.Link>My Surf Journal</Nav.Link>
                              </LinkContainer>,
                              <LinkContainer to='/pubEnts' key={-2}>
                                 <Nav.Link>Public Posts</Nav.Link>
                              </LinkContainer>, 
                              <LinkContainer to='/boardroom' key={-3}>
                                 <Nav.Link>My Board Room</Nav.Link>
                              </LinkContainer>,
                              <LinkContainer to='/register' key={-4}>
                                 <Nav.Link>Register</Nav.Link>
                              </LinkContainer>
                           ]
                           :
                           [
                              <LinkContainer to='/signin' key={-1}>
                                 <Nav.Link>Sign In</Nav.Link>
                              </LinkContainer>,
                              <LinkContainer to='/register' key={-2}>
                                 <Nav.Link>Register</Nav.Link>
                              </LinkContainer>
                           ]
                        }
                     </Nav>
                     {this.signedIn() ?
                        <Nav className="justify-content-end ml-auto" 
                         fill="true">
                              <Navbar.Text key={-4} 
                               onClick={() => this.props.signOut()}>
                                 Sign out
                              </Navbar.Text>
                              
                        </Nav>
                        : ''
                     }
                  </Navbar.Collapse>
                  
                  
               </Navbar>
               {this.signedIn() ?
                     <Nav className="justify-content-end">
                        <Navbar.Text key={-3} className="nav-padding">
                           {`Logged in as: ${this.props.Prss.firstName}
                              ${this.props.Prss.lastName}`}
                        </Navbar.Text>
                     </Nav>
                     : '' 
                  }
            </div>

            {/*Alternate pages beneath navbar, based on current route*/}
            <Switch>
               <Route exact path='/'
                  component={() => Object.keys(this.props.Prss).length !== 0 ? 
                   <Redirect to="/myEnts" /> : <Redirect to="/signin" />} />
               <Route path='/signin' 
                render={() => <SignIn {...this.props} />} />
               <Route path='/register'
                render={() => <Register {...this.props} />} />
                <ProtectedRoute path='/myEnts' component={MyEntsOverview}
                userOnly={true} {...this.props}/>
                <ProtectedRoute path={`/pubEnts/`} component={PubEntsOverview}
                userOnly={true} {...this.props}/>
                <ProtectedRoute path={`/boardroom/`} component={BoardRoom}
                userOnly={true} {...this.props}/>
               />
               
               
               />
            </Switch>

            {/*Error popup dialog*/}
            <ConfDialog
               show={this.props.Errs.length !== 0}
               title="Error Notice"
               body={this.props.Errs[0]}
               buttons={['For Sure']}
               onClose={this.closeErrorConf}
                />

         </div>
      )
   }
}

export default Main
