/**
 * This calls a non-existing api upon user interaction,
 * allowing to check what would happen to other handlers
 * on the same interaction.
 * 
 * The whole module will execute without error until clicking
 * on the button
 */
// Function is defined in `script.html`
onButtonClick(event => {
  console.log('Listener start')
  doSomethingThatDoesNotExist()
  // We won't reach that
  console.log('Listener end')
})
