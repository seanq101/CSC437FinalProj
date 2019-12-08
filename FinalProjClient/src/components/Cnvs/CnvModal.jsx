import React, { Component } from 'react';
import { Modal, Button, Form, FormControl, FormGroup } from 'react-bootstrap';

export default class CnvModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         cnvTitle: (this.props.cnv && this.props.cnv.title) || "",
      }
   }

   close = (result) => {
      console.log("props: ", this.props);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         title: this.state.cnvTitle
      });
   }

   getValidationState = () => {
      if (this.state.cnvTitle) {
         return null;
      }
      return "warning";
   }

   handleChange = (e) => {
      this.setState({cnvTitle: e.target.value});
   }

   componentWillReceiveProps = (nextProps) => {
      if (nextProps.showModal) {
         this.setState(
          { cnvTitle: (nextProps.cnv && nextProps.cnv.title) || "" })
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
                  e.preventDefault() || this.state.cnvTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup controlId="formBasicText"
                   validationstate={this.getValidationState()}
                  >
                     <Form.Label>{this.props.forMsg? '' : 
                     "Conversation Title"}</Form.Label>
                     <FormControl
                        type="text"
                        value={this.state.cnvTitle}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                     />
                     <FormControl.Feedback />
                     {
                        !(this.state.cnvTitle) && 
                        <Form.Text className="text-muted">
                           Title is required
                        </Form.Text>
                     }
                     
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button disabled={this.state.cnvTitle.length === 0} 
                onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}