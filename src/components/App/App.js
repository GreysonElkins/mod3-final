import React, { Component } from 'react';
import './App.css';
import { getOrders, postOrders } from '../../apiCalls';
import Orders from '../../components/Orders/Orders';
import OrderForm from '../../components/OrderForm/OrderForm';

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    getOrders().then(orders => {
      this.setState({ orders: orders.orders })
    })
      .catch(err => console.error('Error fetching:', err));
  }

  makeOrder = async (order) => {
    const response = await postOrders(order)
    if (response.ok) {
      const allOrders = [...this.state.orders, order]
      this.setState({orders: allOrders})
    } else {
      this.setState({message: 'Something went wrong, please try again.'})
    }
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>Burrito Builder</h1>
          <OrderForm />
        </header>

        <Orders orders={this.state.orders}/>
      </main>
    );
  }
}


export default App;
