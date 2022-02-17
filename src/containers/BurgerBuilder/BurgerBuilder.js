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

import * as actionTypes from '../../store/action';





class BurgerBuilder extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {

        
        
        purchaseable: false,
        purchasing: false,
        loading: false,
        error : false
    }

    componentDidMount () {
        // axios.get('https://react-my-burger-8d2e4-default-rtdb.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients : response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     });
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

        this.setState ({purchaseable: sum > 0});
        
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredient = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredient[type] = updatedCount;

    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
    //     this.updatePurchaseState(updatedIngredient);


    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredient = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredient[type] = updatedCount;

    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
    //     this.updatePurchaseState(updatedIngredient);

    // };

    purchasingHandler =()=> {
        this.setState({purchasing: true});
    }

    purchasingCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {

        // alert("You continue!");

        //sending the ingredients information through queryParams to the checkout page.
        const queryParams = [];
        
        for ( let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.state.ingredients[i]));

        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });

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
        let burger = this.state.error ? <p> Ingredients can't be loaded!</p>:<Spinner/>;

        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings} />
                    <BuildControls
                        ingredientAdded= {this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        disabled = {disabledInfo}
                        purchaseable = {this.state.purchaseable}
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
        if(this.state.loading) {
            orderSummary = <Spinner/>
        }

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
        price: state.totalPrice
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

