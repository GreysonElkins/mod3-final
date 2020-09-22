export const getOrders = () => {
  return fetch('http://localhost:3001/api/v1/orders')
      .then(response => response.json())
}

export const postOrders = (order) => {
  try {
    return fetch('http://localhost:3001/api/v1/orders', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order)
    })
  } catch (error) {
    console.error(error)
    return {ok: false}
  }
}