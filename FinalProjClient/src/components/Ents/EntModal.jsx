import React, { Component } from 'react';
import { Modal, Button, Form, FormGroup, Alert, FormControl, FormControlLabel} from 'react-bootstrap';
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

export default class EntModal extends Component {
   //title varchar(80) not null,
// waveHeight int not null,
// content varchar(1000) not null,
// rating int not null,
// loc varchar(80) not null,
// public int not null,
// whenSurfed datetime(3) not null,

   constructor(props) {
      super(props);
      this.state = {
         ownerId: 0,
         title: '',
         waveHeight: 0,
         content: '',
         rating: 0,
         loc: '',
         pub: 0,
         whenSurfed: 0,
         userName: ''
      }
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(ev) {
      let newState = {};
      //Covers the datepicker case
      if(ev.type === undefined)
         newState['whenSurfed'] = ev;
      else {
         switch (ev.target.type) {
         case 'checkbox':
            if (ev.target.id === "pub"){
               if (ev.target.checked)
                  newState[ev.target.id] = 1;
               else
                  newState[ev.target.id] = 0;
            } else {
               newState[ev.target.id] = ev.target.checked;
            }
            
            break;
         default:
            if(ev.target.id === 'waveHeight' || ev.target.id === 'rating')
               newState[ev.target.id] = parseInt(ev.target.value);
            else 
               newState[ev.target.id] = ev.target.value;
         }
      }
      console.log(newState)
      this.setState(newState);
   }

   formValid() {
      let s = this.state;

      return s.title && s.waveHeight && s.content && s.rating && s.loc
       && s.whenSurfed && (s.rating >= 0 && s.rating <= 5) ;
   }

   close = (result) => {
      let { // Make a copy of the relevant values in current state
         ownerId,
         title,
         waveHeight,
         content,
         rating,
         loc,
         pub,
         whenSurfed,
         picURL,
         userName
      } = this.state;

      const newEnt = {
         ownerId,
         title,
         waveHeight,
         content,
         rating,
         loc,
         pub,
         whenSurfed,
         picURL,
         userName
      };
      console.log("props: ", this.props);
      newEnt.picURL = newEnt.picURL === undefined ? null : newEnt.picURL;
      console.log('newEnt: ', newEnt);
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         newEnt: newEnt
      });
      
         

      
   }

   render() {
      return (
         <Modal show={this.props.showModal} onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>Create a New Journal Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.cnvTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>

                     <FieldGroup id="title" type="text" label="Title"
                      placeholder="Enter title" value={this.state.title}
                      onChange={this.handleChange} required={true}
                      />

                     <Form.Label>Notes on the Session</Form.Label>
                     <FormControl id="content"
                        as="textarea"
                        value={this.state.content}
                        placeholder="Enter description"
                        onChange={this.handleChange}
                        rows="4"
                     />

                     <FieldGroup id="loc" type="text" label="Location"
                      placeholder="Enter location" value={this.state.loc}
                      onChange={this.handleChange} required={true}
                      />

                     <FieldGroup id="rating" type="number" label="Rating (0-5)"
                      value={this.state.rating} placeholder="Enter Rating"
                      onChange={this.handleChange} required={true}
                      />

                     {this.state.rating > 5 || this.state.rating < 0 ?
                        <Alert variant="warning">
                           Rating must be 0-5
                        </Alert> : ''
                     }

                     <FieldGroup id="waveHeight" type="number" 
                      label="Wave Height (feet)" value={this.state.waveHeight} 
                      placeholder="Enter Wave Height"
                      onChange={this.handleChange} required={true}
                      />
   
                     <FieldGroup id="picURL" type="text" 
                      label="Picture URL (if you have one)"
                      value={this.state.picURL} 
                      placeholder="Enter Wave Height"
                      onChange={this.handleChange} required={true}
                      />

                     <Form.Label>Date of Surf</Form.Label>
                     <br></br>
                     <DatePicker
                      selected={this.state.whenSurfed}
                      onChange={this.handleChange}
                      />

                      <br></br>

                     <Form.Check  id="pub"
                      value={this.state.pub} onChange={this.handleChange}
                      label="Do you want to make this entry public?"/>

                  {/* <FormGroup controlId="formBasicText">
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
                     
                  </FormGroup> */}
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