import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';


class App extends Component {
  //FOR TEST PURPOSE
  // state = {
  //   show : true
  // }
  // componentDidMount() {
  //   setTimeout(() =>{
  //     this.setState({show: false});
  //   }, 5000 )
  // }
  render() {
    return (
      <div >
        <Layout>
          {/* FOR TEST PURPOSE ONLY */}
          {/* {this.state.show ?<BurgerBuilder/> : null} */}
          <BurgerBuilder/>
          <Checkout/>
        </Layout>
      </div>
    );
  }
  
}

export default App;
