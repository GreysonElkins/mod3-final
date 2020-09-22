import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import OrderForm from './OrderForm'

describe('Order form', () => {
  let mockMakeOrder

  beforeEach(() => {
    mockMakeOrder = jest.fn()
    render(<OrderForm makeOrder={mockMakeOrder}/>)
  })

  it('Should have an input and 12 buttons', () => {
    const input = screen.getByRole('textbox')
    const buttons = screen.getAllByRole('button')

    expect(input).toBeInTheDocument()
    expect(buttons).toHaveLength(13)
  })

  it('Should allow the user to enter a name', () => {
    const input = screen.getByRole('textbox')
    fireEvent.change(input, {target: {value: 'Greyson Elkins'}})
    expect(input.value).toBe('Greyson Elkins')
  })
  
  it('Should show ingredients which the user has clicked in a list', () => {
    const beans = screen.getByRole('button', {name: 'beans'})
    const carnitas = screen.getByRole('button', {name: 'carnitas'})
    fireEvent.click(beans)
    fireEvent.click(carnitas)
    const orderText = screen.getByText('Order: beans, carnitas')
    
    expect(orderText).toBeInTheDocument()
  })
  
  it('Should fire makeOrder when an order is submitted with the submit button', () => {
    const input = screen.getByRole('textbox')
    fireEvent.change(input, {target: {value: 'Greyson Elkins'}})

    const beans = screen.getByRole('button', {name: 'beans'})
    const carnitas = screen.getByRole('button', {name: 'carnitas'})

    fireEvent.click(beans)
    fireEvent.click(carnitas)
    const submit = screen.getByRole('button', {name: 'Submit Order'})
    fireEvent.click(submit)

    expect(mockMakeOrder).toBeCalledTimes(1)
  })

  it('Should not fire makeOrder if submit is clicked without a name in the textbox', () => {
    const beans = screen.getByRole('button', {name: 'beans'})
    const carnitas = screen.getByRole('button', {name: 'carnitas'})

    fireEvent.click(beans)
    fireEvent.click(carnitas)
    const submit = screen.getByRole('button', {name: 'Submit Order'})
    fireEvent.click(submit)

    expect(mockMakeOrder).not.toBeCalledTimes(1)
  })

  it('Should display a message if the submit button is clicked without at least one ingredient', () => {
    const submit = screen.getByRole("button", { name: "Submit Order" });
    fireEvent.click(submit);
    const message = screen.getByText('You need to select at least one ingredient and provide a name')

    expect(mockMakeOrder).not.toBeCalledTimes(1);
    expect(message).toBeInTheDocument()
  })
  
  it('Should not allow a user to submit more than two of the same ingredient', () => {
    const beans = screen.getByRole('button', {name: 'beans'})
    fireEvent.click(beans)
    fireEvent.click(beans) 
    const orderText = screen.getByText("Order: beans, beans");
    expect(orderText).toBeInTheDocument()
    
    fireEvent.click(beans) 
    const orderTextTwo = screen.queryByText("Order: beans, beans, beans")
    expect(orderText).toBeInTheDocument()
    expect(orderTextTwo).not.toBeInTheDocument()

  })

})