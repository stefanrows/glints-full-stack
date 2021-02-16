const initialTodos = [
  {
    restaurant: 'TestRest1',
    days: {
      monday: {
        opening: '11am',
        closing: '4pm',
      },
      tuesday: { opening: '11am', closing: '4pm' },
      wednesday: { opening: '11am', closing: '4pm' },
      thursday: { opening: '11am', closing: '4pm' },
      friday: { opening: '11am', closing: '4pm' },
      saturday: { opening: '11am', closing: '4pm' },
      sunday: { opening: '11am', closing: '4pm' },
    },
  },
]

const RestaurantCards = () => {
  console.log(initialTodos)
}

RestaurantCards()
