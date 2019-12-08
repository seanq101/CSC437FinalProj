import React, {Component} from 'react';
import {ListGroup, Col, Row, Button, Form, FormGroup} from 'react-bootstrap';
import {MsgItem, MsgModal} from '../components';

import './CnvOverview.css';

export default class CnvDetail extends Component {
   constructor(props) {
      super(props);
      const second = 2;
      let cnvId = this.props.location.pathname.split('/')[second];
      this.props.updateMsgs(cnvId)
      this.state = {
         newMessage: '',
         cnvId: cnvId,
         showModal: false
      }
   }

   getValidationState = () => {
      if (this.state.newMessage) {
         return null;
      }
      return "warning";
   }

   formSubmit = (event) => {
      this.props.addMsg({ content: this.state.newMessage }, this.state.cnvId,
         () => {
            
            this.props.updateMsgs(this.state.cnvId,
               () => {this.setState({newMessage: ''})})
            
         });
      console.log(this.state.newMessage);
   }

   formValid = () => {
      return this.state.newMessage.length
   }

   handleChange = (e) => {
      this.setState({newMessage: e.target.value});
   }

   hideContent (e) {
      console.log(e)
      console.log(this)
   }

   closeErrorConf = (btn) => {
      this.props.clearErrors();
   }

   openModal = (cnv) => {
      this.setState({showModal: true});
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         console.log(result)

         this.props.addMsg({ content: result.message }, this.state.cnvId,
            () => {
               
               this.props.updateMsgs(this.state.cnvId,
                () => {this.setState({newMessage: ''})})
               
            });
         
      }
      this.setState({ showModal: false,  });
   }

   render() {
      console.log("Rerendering Cnv Detail ", this.state.messages);

      
      var messages = this.props.Msgs;
      var msgItems = [];
 
      if(messages.length){
         messages.forEach((msg, idx) => {
            msgItems.push(<MsgItem
                  key={msg.content}
                  content={msg.content} // <- use content here bc a newly added
                  id={msg.id}           // msg does not get its id returned 
                  email={msg.email}     // as per REST Spec
                  whenMade={msg.whenMade}
                  hideContent={() => this.hideContent(this)}
                  ishidden={0}
                  onDelete={() => this.openConfirmation(msg)}
                  onEdit={() => this.openModal(msg)} />);
         });
      }
      

      return (
         <section className="container">
            <h1>Conversation Detail</h1>
            <Row hidden={this.props.Msgs.length === 0}>
               
               <Col sm={4}>
                  Email
               </Col>
               <Col sm={4}>
                  Date
               </Col>
            </Row>
            
          
            <ListGroup>
               {msgItems}
            </ListGroup>

            <Form>

               
               <FormGroup>
                  <Col>
                     <Button onClick={this.openModal}>
                        Create New Message
                     </Button>
                 </Col>
               </FormGroup>

            </Form>

            <MsgModal
               showModal={this.state.showModal}
               title={"Enter New Message"}
               onDismiss={this.modalDismiss} 
               forMsg={true}/>
            
         </section>
      )
   }
}
