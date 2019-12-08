import React, { Component } from 'react';
import {
    Modal, Button, Form, FormControl, FormGroup
} from 'react-bootstrap';

export default class MsgModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         message: (this.props.cnv && this.props.cnv.title) || "",
      }
   }

   close = (result) => {
      console.log("props: ", this.props);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         message: this.state.message
      });
   }

   getValidationState = () => {
      if (this.state.message) {
         return null;
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({message: e.target.value});
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState(
          { message: (nextProps.cnv && nextProps.cnv.title) || "" })
      }
   }

   render() {
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.message.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationstate={this.getValidationState()}
                  >
                     <Form.Label>{this.props.forMsg? '' : 
                      "Conversation Title"}</Form.Label>
                     <FormControl
                        as="textarea"
                        value={this.state.message}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                        rows="4"
                     />
                     <FormControl.Feedback />
                     
                     
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}