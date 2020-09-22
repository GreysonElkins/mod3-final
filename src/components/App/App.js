import React, { Component } from 'react';
import './App.css';
import { getOrders, postOrders, deleteOrder } from '../../apiCalls';
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
    let response
    postOrders(order).then(res => {
      response = res
      return response.json()
    }).then((postedOrder) => {
      if (response.ok) {
        const allOrders = [...this.state.orders, postedOrder]
        this.setState({orders: allOrders})
      } else {
        this.setState({message: 'Something went wrong, please try again.'})
      }
    })
  }

  updateOrders = () => {
    getOrders()
      .then((orders) => {
        this.setState({ orders: orders.orders });
      })
      .catch((err) => console.error("Error fetching:", err));
  }

  finishOrder = (id) => {
    deleteOrder(id).then(response => {
      if(response.ok) {
        this.removeTicket(id)
      } else {
        this.setState({message: 'Something went wrong, please try again.'})
      }
    })
  }

  removeTicket = (id) => {
    const update = this.state.orders.filter(order => order.id !== id)
    this.setState({ orders: update })
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>Burrito Builder</h1>
          <OrderForm makeOrder={this.makeOrder}/>
        </header>
        <p>{this.state.message}</p>
        <Orders orders={this.state.orders} finishOrder={this.finishOrder}/>
      </main>
    );
  }
}


export default App;
