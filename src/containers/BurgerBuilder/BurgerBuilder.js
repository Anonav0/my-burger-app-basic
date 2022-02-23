import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders'; 


import * as burgerBuilderActions from '../../store/actions/index';






class BurgerBuilder extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false,

    }

    componentDidMount () {
        this.props.onInitIngredients();
    };

    updatePurchaseState (ingredients) {
        // const ingredients = {
        //     ...this.state.ingredients
        // }
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum+el;
            },0);

        return  sum > 0;
        
    }



    purchasingHandler =()=> {
        this.setState({purchasing: true});
    }

    purchasingCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');

    }

    render() {
        //logic to turn the ingredients from number based to boolean based object.
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 ; // {salad: true, bacon : false ....}
        };

        //THIS WILL LOAD THE SPINNER BEFORE LOADING THE INGREDIENTS FROM FIREBASE
        let orderSummary = null;
        let burger = this.props.error ? <p> Ingredients can't be loaded!</p>:<Spinner/>;

        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings} />
                    <BuildControls
                        ingredientAdded= {this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        disabled = {disabledInfo}
                        purchaseable = {this.updatePurchaseState(this.props.ings)}
                        price = {this.props.price}
                        ordered = {this.purchasingHandler}
                         />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients= {this.props.ings}
                totalPrice = {this.props.price}
                purchaseCancelled = {this.purchasingCancelHandler}
                purchaseContinued = {this.purchaseContinueHandler}/>;
        };


        return(
            <Aux>
                <Modal show= {this.state.purchasing} modalClosed={this.purchasingCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        ); 
    }
}


const mapStateToProps = state => {
    return {
        ings : state.ingredients,
        price: state.totalPrice,
        error: state.error
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients : () => dispatch(burgerBuilderActions.initIngredients())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

