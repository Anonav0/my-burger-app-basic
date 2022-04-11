import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders'; 


import * as actions from '../../store/actions/index';





const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

 
    useEffect(() => {
        props.onInitIngredients();
    }, [])


    const updatePurchaseState = (ingredients) => {
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



    const purchasingHandler = () => {
        if(props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
        
    }

    const purchasingCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout');

    }


        //logic to turn the ingredients from number based to boolean based object.
        const disabledInfo = {
            ...props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 ; // {salad: true, bacon : false ....}
        };

        //THIS WILL LOAD THE SPINNER BEFORE LOADING THE INGREDIENTS FROM FIREBASE
        let orderSummary = null;
        let burger = props.error ? <p> Ingredients can't be loaded!</p>:<Spinner/>;

        if(props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients = {props.ings} />
                    <BuildControls
                        ingredientAdded= {props.onIngredientAdded}
                        ingredientRemoved = {props.onIngredientRemoved}
                        disabled = {disabledInfo}
                        purchaseable = {updatePurchaseState(props.ings)}
                        isAuth={props.isAuthenticated}
                        price = {props.price}
                        ordered = {purchasingHandler}
                         />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients= {props.ings}
                totalPrice = {props.price}
                purchaseCancelled = {purchasingCancelHandler}
                purchaseContinued = {purchaseContinueHandler}/>;
        };


        return(
            <Aux>
                <Modal show= {purchasing} modalClosed={purchasingCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        ); 

}


const mapStateToProps = state => {
    return {
        ings : state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients : () => dispatch(actions.initIngredients()),
        onInitPurchase : () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

