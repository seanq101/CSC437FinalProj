import React, {Component} from 'react';
import {ListGroupItem, Col, Row} from 'react-bootstrap';
export default class MsgItem extends Component {


   constructor(props){
      
      super(props);
      this.state= {
         isHidden: true
      }
   }

   toggleHidden = () => {
      this.setState({isHidden: !this.state.isHidden})
   }

   render() {
      return (
         <ListGroupItem>
            <Row onClick={this.toggleHidden}>
            <Col sm={4}>{new Intl.DateTimeFormat('us',
                  {
                     year: "numeric", month: "short", day: "numeric",
                     hour: "2-digit", minute: "2-digit", second: "2-digit"
                  })
                  .format(new Date(this.props.whenMade))}
               </Col>
               
               <Col sm={4}>
                  {this.props.email}
               </Col>
            </Row>
            <Row hidden={this.state.isHidden}>
               {this.props.content}
            </Row>
         </ListGroupItem>
      )
   }
   
}

