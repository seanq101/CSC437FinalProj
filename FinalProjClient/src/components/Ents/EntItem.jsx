import React, {Component} from 'react';
import {ListGroupItem, Col, Row} from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import './Ent.css';

export default class EntItem extends Component {


   constructor(props){
      
      super(props);
      console.log("item's props",this.props)
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
               
            <Col sm={4}><h2>
            {this.props.title}
                  </h2></Col>
            <Col sm={4}>{new Intl.DateTimeFormat('us',
                  {
                     year: "numeric", month: "short", day: "numeric",
                     hour: "2-digit", minute: "2-digit", second: "2-digit"
                  })
                  .format(new Date(this.props.whenSurfed))}
               </Col>
               
               <Col sm={4}>
                  <StarRatings
                     rating={this.props.rating}
                     starRatedColor="blue"
                     changeRating={this.changeRating}
                     numberOfStars={5}
                     name='rating'
                     starDimension={"25"}
                  />
               </Col>

            </Row>
            <Row hidden={this.state.isHidden}>
               <Col sm={4}>
                  {this.props.picURL ? 
                     <img alt={this.props.title} className="surfing-img" src={this.props.picURL}></img> 
                     : 
                     ''
                  }
               </Col>
            
               <Col sm={8}>

                  <p>{this.props.content}</p>
                  
                  <p>Location: {this.props.loc}</p>
                  
                  <p>Wave Height: {this.props.waveHeight}ft</p>
                  
                  {this.props.onPubPage ? 
                  <p>Submitted By: {this.props.name}</p>: ''}
               </Col>

            </Row>
         </ListGroupItem>
      )
   }
   
}

