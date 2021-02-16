import React from 'react'

export const TodoList = (props) => {
  return (
    <div>
      {props.todos.map((todo, index) => (
        <div key={index}>
          <li>{todo.restaurant}</li>
        </div>
      ))}
    </div>
  )
}
