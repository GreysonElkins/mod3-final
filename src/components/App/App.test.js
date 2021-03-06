import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";
import { getOrders, postOrders, deleteOrder } from "../../apiCalls";
jest.mock('../../apiCalls.js')

describe ('App', () => {
  beforeEach(async () => {
    await waitFor(() => {
      getOrders.mockResolvedValueOnce({
        orders: [{
          id: 1,
          name: 'Ringo Star', 
          ingredients: ['lettuce', 'pico de gallo', 'guacamole', 'cilantro', 'sour cream']
        }]
      })
    })  
    render(<App />)
  })

  afterEach(() => {
    getOrders.mockClear()
  })

  it('should have a title', async () => {
    const title = screen.queryByRole('heading', { name: 'Burrito Builder'})

    await waitFor(() => expect(title).toBeInTheDocument())
  })

  it('should call a fetch for getting orders on load', () => {
    expect(getOrders).toHaveBeenCalledTimes(1)
  })

  it('should display the results of that call', () =>{ 
    const ringoCard = screen.getByText('Ringo Star')
    expect(ringoCard).toBeInTheDocument()
  })

  it('should load the OrderForm component', () => {
    const input = screen.getByRole("textbox");
    const submit = screen.getByRole("button", { name: 'Submit Order' });

    expect(input).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
  })

  it('should allow users to submit new orders, and show those orders once posted', async () => {
    await waitFor(() => {postOrders.mockResolvedValueOnce({
          ok: true, 
          json: () => { 
            return {
                id: 2,
                name: 'George Harry', 
                ingredients: ['beans', 'carnitas']
              }
          }
        })
    })

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "George Harry" } });

    const beans = screen.getByRole("button", { name: "beans" });
    const carnitas = screen.getByRole("button", { name: "carnitas" });

    fireEvent.click(beans);
    fireEvent.click(carnitas);
    const submit = screen.getByRole("button", { name: "Submit Order" });
    fireEvent.click(submit);

    expect(postOrders).toHaveBeenCalled()
    expect(postOrders).toHaveBeenCalledWith({name: 'George Harry', ingredients: ['beans', 'carnitas']})

    await waitFor(() => {
      const harryCard = screen.getByText('George Harry')
      expect(harryCard).toBeInTheDocument()
    })
  })

  it('should allow users to delete an order by clicking "DONE"', async () => {
    deleteOrder.mockResolvedValueOnce({ok: true})

    const ringoCard = screen.queryByText('Ringo Star')
    expect(ringoCard).toBeInTheDocument()
    const ringoDoneButton = screen.getByRole('button', { name: 'delete ticket 1'})
    fireEvent.click(ringoDoneButton)

    await waitFor(() => expect(ringoCard).not.toBeInTheDocument())
  })
})

