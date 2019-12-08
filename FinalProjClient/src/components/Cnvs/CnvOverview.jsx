import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ListGroup, ListGroupItem, Col, Row, Button} from 'react-bootstrap';
import CnvModal from './CnvModal';
import {ConfDialog} from '../components';
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         showModal: false,
         showConfirmation: false,
      }
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      this.setState({showModal: true, editCnv: cnv});
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editCnv)
            this.modCnv(result);
         else
            this.newCnv(result);
      }
      this.setState({ showModal: false, editCnv: null });
   }

   modCnv(result) {
      this.props.modCnv(this.state.editCnv.id, result.title);
      this.props.updateCnvs();
   }

   newCnv(result) {
      this.props.addCnv({ title: result.title });
   }

   openConfirmation = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if(res === "Yes"){
         this.props.delCnv(this.state.delCnv.id);
         //this.props.updateCnvs();
         this.setState({showConfirmation: false, delCnv: null });
      } else {
         console.log(res)
         this.setState({ showConfirmation: false, delCnv: null });
      }
      
   }

   openEdit = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true })
   }

   

   render() {
      console.log("Rerendering Cnv Overview ", this.props);
      var cnvItems = [];
      console.log(this.props.Cnvs)
      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            cnvItems.push(<CnvItem
               key={cnv.id}
               title={cnv.title}
               lastMessage={cnv.lastMessage}
               id={cnv.id}
               showControls={cnv.ownerId === this.props.Prss.id || 
                this.props.Prss.role === 1}
               onDelete={() => this.openConfirmation(cnv)}
               onEdit={() => this.openModal(cnv)} />);
      });

      return (
         <section className="container">
            <h1>Cnv Overview</h1>

            <ListGroup className="padded">
               {cnvItems}
            </ListGroup>
            <Button variant="primary" onClick=
               {() => this.openModal()}>New Conversation</Button>
            {/* Modal for creating and change cnv */}
            
            <CnvModal
               showModal={this.state.showModal}
               //show={this.state.showEdit}
               title={this.state.editCnv ? "Edit title" : "New Conversation"}
               cnv={this.state.editCnv}
               onDismiss={this.modalDismiss} />
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete Conversation"
               body={`Are you sure you want to delete the Conversation
           '${this.state.delCnv ? this.state.delCnv.title : ''}'`}
               buttons={['Yes', 'Abort']}
               onClose={this.closeConfirmation} />
         </section>
      )
   }
}

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row> 
            <Col sm={4} className="float-left">
               <Link to={"/CnvDetail/" + props.id}>{props.title}</Link>
            </Col>
            {
               props.lastMessage ? 
                  <Col sm={4} 
                   className="float-left">{new Intl.DateTimeFormat('us',
                  {
                     year: "numeric", month: "short", day: "numeric",
                     hour: "2-digit", minute: "2-digit", second: "2-digit"
                  })
                  .format(new Date(props.lastMessage))}
                  </Col> 
                  : 
                  <Col sm={4}> N/A </Col>
            }
            
            
            {props.showControls ?
               <Col sm={4} className="float-right right-text">
                  <Button size="sm" onClick={props.onDelete} 
                   className="favicon">
                     <span className="fa fa-trash"/>
                  </Button>
                  <Button size="sm" onClick={props.onEdit} className="favicon">
                     <span className="fa fa-edit"/>
                  </Button>
               </Col>
               : ''}
         </Row>
      </ListGroupItem>
   )
}
