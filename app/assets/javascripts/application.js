//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  document.querySelector('.js-trigger-custom-event').addEventListener('click', () => {

    const event = new CustomEvent('click', {bubbles: true});
    console.log('Before custom event dispatch')
    document.querySelector('.js-interact-with-me').dispatchEvent(event);
    console.log('After custom event dispatch')
  })
})
