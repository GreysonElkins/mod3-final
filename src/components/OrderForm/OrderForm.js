import React, { Component } from 'react';

class OrderForm extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      message: '',
      name: '',
      ingredients: []
    };
  }


  handleSubmit = e => {
    e.preventDefault();
    if (this.state.ingredients.length < 1 || this.state.name === '') {
      this.setState({ message: 'You need to select at least one ingredient and provide a name' })
    } else {
      const order = {
        name: this.state.name,
        ingredients: this.state.ingredients
      }
      this.props.makeOrder(order)
      this.clearInputs();
    }
  }

  handleIngredientChange = (e) => {
    e.preventDefault()
    const ingredient = e.target.name
    if (!this.hasTooManyIngredient(ingredient)) {
      const newList = [...this.state.ingredients, ingredient]
      this.setState({ ingredients: newList, message: '' })
    }
  }

  hasTooManyIngredient(ingredient) {
    const qtyInCurrentOrder = this.state.ingredients.filter(ing => ing === ingredient)
    if (qtyInCurrentOrder.length === 2) {
      this.setState({ message: `The customer can't eat that much ${ingredient}, recommend something else` })
      return true
    } else {
      return false
    }

  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value, message: '' })
  }

  clearInputs = () => {
    this.setState({name: '', ingredients: [], message: ''});
  }

  render() {
    const possibleIngredients = ['beans', 'steak', 'carnitas', 'sofritas', 'lettuce', 'queso fresco', 'pico de gallo', 'hot sauce', 'guacamole', 'jalapenos', 'cilantro', 'sour cream'];
    const ingredientButtons = possibleIngredients.map(ingredient => {
      return (
        <button key={ingredient} name={ingredient} onClick={e => this.handleIngredientChange(e)}>
          {ingredient}
        </button>
      )
    });

    return (
      <form>
        <input
          type='text'
          placeholder='Name'
          name='name'
          value={this.state.name}
          onChange={e => this.handleNameChange(e)}
        />

        { ingredientButtons }

        <p>Order: { this.state.ingredients.join(', ') || 'Nothing selected' }</p>
        <p>{this.state.message}</p>
        <button onClick={e => this.handleSubmit(e)}>
          Submit Order
        </button>
      </form>
    )
  }
}

export default OrderForm;
