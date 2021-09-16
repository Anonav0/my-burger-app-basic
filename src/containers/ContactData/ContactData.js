import React, {Component} from 'react';

import Button from '../../components/UI/Button/Button';
import classes from './ContactData.module.css'
import axios from '../../../src/axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm : {
 
            name : {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street : {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'street'
                },
                value: ''
            },
            zipCode :  {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: ''
            },
            country :  {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Country'
                },
                value: ''
            },
            email:  {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: ''
            },
            deliveryMethod :  {
                elementType: 'select',
                elementConfig: {
                    options : [{value: 'fastest', displayValue: 'Fastest'},
                               {value: 'cheapest', displayValue: 'Cheapest'}]
                },
                value: ''
            }
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props.ingredients);
        this.setState({loading: true});
        const order = {
            ingredients : this.props.ingredients,
            price : this.props.price
        }
        axios.post('/orders.json', order)
            .then( response => {
                this.setState({loading: false});
                this.props.history.push('/')
                // console.log(response);
            })
            .catch(error => {
                this.setState({loading: false});
                // console.log(error);
            })

    }
    
    render () {
        let form = (<form >
                <Input elementType='...' elementConfig='....' value='....'/>
                <Input inputtype="input"  type='text' name="street" placeholder="street"/>
                <Input inputtype="input"  type='text' name="email" placeholder="Your mail"/>
                <Input inputtype="input"  type='text' name="postal" placeholder="Postal"/>
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>);
        if(this.state.loading) {
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
} 

export default ContactData;