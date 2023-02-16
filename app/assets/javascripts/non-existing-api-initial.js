export function exportedAtTheStart() {};
// The browser does not provide any `SomethingThatDoesNotExist()` class
// so this will parse, but fail when the browser executes the script
console.log('Loaded script start')

new SomethingThatDoesNotExist()

// We'll never reach that point
console.log('Loaded script end')

export function exportedAtTheEnd() {};
