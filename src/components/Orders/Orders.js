import React from 'react';
import './Orders.css';

const Orders = props => {
  const orderEls = props.orders.map((order, i) => {
    return (
      <div className="order" key={`order-${i}`}>
        <h3>{order.name}</h3>
        <ul className="ingredient-list">
          {order.ingredients.map(ingredient => {
            return <li>{ingredient}</li>
          })}
        </ul>
        {order.id 
          && <button 
              onClick={() => props.finishOrder(order.id)}
            >
              DONE
            </button>}
      </div>
    )
  });

  return (
    <section>
      { orderEls.length ? orderEls : <p>No orders yet!</p> }
    </section>
  )
}

export default Orders;