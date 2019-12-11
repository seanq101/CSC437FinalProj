import React, { Component } from 'react';
import { Modal, Button, Form, FormGroup, Alert, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function FieldGroup({id, label, help, ...props }) {
   return (
       <FormGroup controlId={id}>
          <Form.Label>{label}</Form.Label>
          <Form.Control {...props} />
          {help && <Form.Text className="text-muted">{help}</Form.Text>}
       </FormGroup>
   );
}

export default class BoardModal extends Component {
// prId int,
// bName varchar(80) not null,
// heightFT int not null,
// heightIN int not null,
// picURL varchar(500),

   constructor(props) {
      super(props);
      this.state = {
         bName: '',
         heightFT: 0,
         heightIN: 0,
         picURL: ''
      }
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(ev) {
      let newState = {};
      //Covers the datepicker case

      
      

      if(ev.target.id === 'heightFT' || ev.target.id === 'heightIN')
         newState[ev.target.id] = parseInt(ev.target.value);
      else 
         newState[ev.target.id] = ev.target.value;
      
      
      console.log(newState)
      this.setState(newState);
   }

   formValid() {
      let s = this.state;

      return s.bName && s.heightFT && (s.heightIN >= 0 && s.heightIN < 12)
       && s.picURL.length > 0;
   }

   close = (result) => {
      let { // Make a copy of the relevant values in current state
         bName,
         heightFT,
         heightIN,
         picURL
      } = this.state;

      const newBoard = {
         bName,
         heightFT,
         heightIN,
         picURL
      };

      newBoard.picURL = newBoard.picURL === undefined ? null : newBoard.picURL;
      console.log('newBoard: ', newBoard);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         newBoard: newBoard
      });
      
   }

   render() {

      var boardOptions = [];
      console.log('modal props', this.props)
      if (this.props.boards && this.props.boards.length > 0){
         this.props.boards.forEach(board => {boardOptions.push(<option value={board.id}>{board.bName}</option>)});
      }
      
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>Create a New Journal Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.cnvTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>

                     <FieldGroup id="bName" type="text" label="Board Name"
                      placeholder="Enter name" value={this.state.bName}
                      onChange={this.handleChange} required={true}
                      />

                     <FieldGroup id="heightFT" type="number" 
                      label="Board Height (Feet)"
                      value={this.state.heightFT} 
                      placeholder="Enter number of feet"
                      onChange={this.handleChange} required={true}
                      />

                     <FieldGroup id="heightIN" type="number" 
                      label="Board Height (Inches)"
                      value={this.state.heightIN} 
                      placeholder="Enter number of inches extra"
                      onChange={this.handleChange} required={true}
                      />

                     {this.state.heightIN > 11 || this.state.rating < 0 ?
                        <Alert variant="warning">
                           Inches must be 0-11
                        </Alert> : ''
                     }

                    
                     <FieldGroup id="picURL" type="text" 
                      label="Picture URL (if you have one)"
                      value={this.state.picURL} 
                      placeholder="Enter Wave Height"
                      onChange={this.handleChange} required={true}
                      />

               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" disabled={!this.formValid()} 
                onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>)
   }
}