import React, {Component} from 'react';
import {ListGroup} from 'react-bootstrap';
import {ConfDialog, EntItem} from '../components';
import './Ent.css';


export default class PubEntsOverview extends Component {
   constructor(props) {
      super(props);
      this.props.getPublicEntries();
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
         result.newEnt['ownerId'] = this.props.Prss.id
         result.newEnt['userName'] = this.props.Prss.firstName + ' ' + 
          this.props.Prss.firstName;
         console.log('in overview', result.newEnt)
         this.newEnt(result.newEnt);
      }
      this.setState({ showModal: false });
   }

   modCnv(result) {
      this.props.modCnv(this.state.editCnv.id, result.title);
      this.props.updateCnvs();
   }

   newEnt(result) {
      this.props.addEntry(result);
   }

   openConfirmation = (cnv) => {
      this.setState({ delEnt: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if(res === "Yes"){
         this.props.delEnt(this.state.delEnt.id,
            () => this.setState({showConfirmation: false, delEnt: null }));
         //this.props.updateCnvs();
         
      } else {
         console.log(res)
         this.setState({ showConfirmation: false, delEnt: null });
      }
      
   }

   openEdit = (cnv) => {
      this.setState({ delEnt: cnv, showConfirmation: true })
   }

   

   render() {
      console.log("Rerendering My Ents Overview ", this.props);
      var entries = [];
      console.log(this.props.Ents)
      this.props.Ents.forEach(ent => {
         //if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            entries.push(<EntItem
               key={ent.id}
               ownerId={ent.ownerId}
               title={ent.title}
               waveHeight={ent.waveHeight}
               content={ent.content}
               rating={ent.rating}
               loc={ent.loc}
               pub={ent.pub}
               whenSurfed={ent.whenSurfed}
               picURL={ent.picURL}
               id={ent.id}
               name={ent.userName}
               showControls={ent.ownerId === this.props.Prss.id || 
                this.props.Prss.role === 1}
               onPubPage={1}
               onDelete={() => this.openConfirmation(ent)}
               />);
      });

      return (
         <section className="container">
            <h1>Public Posts</h1>

            <ListGroup className="padded">
               {entries}
            </ListGroup>
    
           
            
            
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete Entry"
               body={`Are you sure you want to delete the Entry
           '${this.state.delEnt ? this.state.delEnt.title : ''}'`}
               buttons={['Yes', 'Abort']}
               onClose={this.closeConfirmation} />
         </section>
      )
   }
}
