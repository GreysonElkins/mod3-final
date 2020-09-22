import React, { Component } from 'react';
import './App.css';
import { getOrders, postOrders } from '../../apiCalls';
import Orders from '../../components/Orders/Orders';
import OrderForm from '../../components/OrderForm/OrderForm';

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      orders: [],
      message: ''
    }
  }

  componentDidMount() {
    this.updateOrders()
  }

  makeOrder = async (order) => {
    const response = await postOrders(order)
    if (response.ok) {
      // I successfully took the response and used it directly in state with an id
      // it broke my app tests, which I spent time trying to fix, but couldn't figure out what was wrong
      // that work is on branch "post-response-ids"
      const allOrders = [...this.state.orders, order]
      this.setState({orders: allOrders})
      this.updateOrders()
    } else {
      this.setState({message: 'Something went wrong, please try again.'})
    }
  }

  updateOrders = () => {
     getOrders()
       .then((orders) => {
         this.setState({ orders: orders.orders });
       })
       .catch((err) => console.error("Error fetching:", err));
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>Burrito Builder</h1>
          <OrderForm makeOrder={this.makeOrder}/>
        </header>
        <p>{this.state.message}</p>
        <Orders orders={this.state.orders}/>
      </main>
    );
  }
}


export default App;
