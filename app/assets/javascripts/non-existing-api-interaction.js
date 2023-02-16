console.log('Before registering listeners')

// Simulates a 3rd party listener registered before breaking code
onButtonClick(event => {
  console.log('In click listener registered before')
})

onButtonClick(event => {
  console.log('Before listener')
  doSomethingThatDoesNotExist()
  // We won't reach that
  console.log('After listener')
})

// Simulates a 3rd party listener registered after breaking code
onButtonClick(event => {
  console.log('In click listener registered after')
})
console.log('After registering listeners')

function onButtonClick(handler) {
  document.addEventListener('click', event => {
    if (event.target.closest('button')) {
      handler(event)
    }
  })
}
