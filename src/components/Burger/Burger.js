import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    //Logic to change ingredients object coming from burger container into an array with other including jsx arrays.
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey}/>// printing the individual BurgerIngredient here.
            });
        })
        .reduce((arr, el) => {// for returning the inner values of array onto the outer array.
            return arr.concat(el);
        }, []);
        
        
        if(transformedIngredients.length === 0) {
            transformedIngredients = <p>Please start adding ingredients!!!</p>
        }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;