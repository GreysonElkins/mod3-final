import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";
import { getOrders, postOrders } from "../../apiCalls";
jest.mock('../../apiCalls.js')

describe ('App', () => {
  beforeEach(async () => {
    await waitFor(() => {
      getOrders.mockResolvedValueOnce({orders: [
          {
            name: 'Ringo Star', 
            ingredients: ['lettuce', 'pico de gallo', 'guacamole', 'cilantro', 'sour cream']
          }
        ]})
      })
    render(<App />)
  })

  afterEach(() => {
    getOrders.mockClear()
  })

  it('should have a title', () => {
    const title = screen.getByRole('heading', { name: 'Burrito Builder'})

    expect(title).toBeInTheDocument()
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
    const buttons = screen.getAllByRole("button");

    expect(input).toBeInTheDocument();
    expect(buttons).toHaveLength(13);
  })

  it('should allow users to submit new orders, and show those orders once posted', async () => {
    await waitFor(() => {postOrders.mockResolvedValueOnce({ok: true})})

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



})
