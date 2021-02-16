import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: lightgray;
  border: 1px solid black;
  padding: 10px;
`

export const RestaurantCards = () => {
  // const [todos, setTodos] = useState(initialTodos)
  const [time, setTime] = useState('00:00')
  const [date, setDate] = useState(new Date().toISOString())
  const [searchResults, setSearchResults] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('Submitting')

    /*
    const splitTime = time.split(':')
    const hoursString = splitTime[0]
    const minutesString = splitTime[1]
    */
    //Destructuring
    const [hoursString, minutesString] = time.split(':')
    const hours = parseInt(hoursString, 10)
    const minutes = parseInt(minutesString, 10) / 60
    console.log(hoursString, minutesString)
    const payload = {
      // hours,
      // minutes,
      startTime: hours + minutes,
      date,
    }
    const requestPayload = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    }
    const response = await fetch('http://localhost:5000/', requestPayload)
    const data = await response.json()
    setSearchResults(data.data)
  }

  function handleDateOnChange(e) {
    setDate(e.target.value)
  }

  function handleTimeOnChange(e) {
    setTime(e.target.value)
  }

  return (
    <Container>
      <h2>Mockup Data</h2>
      <form onSubmit={handleSubmit}>
        // I listen for changes to the input value // When there is a change I
        set state to the new value // my input value is this updated state //
        using controlled inputs in React
        <input type='date' value={date} onChange={handleDateOnChange}></input>
        <input type='time' onChange={handleTimeOnChange} value={time}></input>
        <input type='submit'></input>
      </form>
      {searchResults.map((result, index) => {
        return (
          <Result key={index} name={result.name} hours={result.openHours} />
        )
      })}
    </Container>
  )
}

// id, name, days

function Result(props) {
  return (
    <div>
      <strong>{props.name} </strong>
      <p>{props.hours}</p>
    </div>
  )
}

// 02:15 = 2.25
// Split into hours and minutes
// Convert minutes to decimals of hours
// Add them together
