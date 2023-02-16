// The browser does not provide any `SomethingThatDoesNotExist()` class
// so this will parse, but fail when the browser executes the script
console.log('Before non-existing class')
new SomethingThatDoesNotExist()
// We'll never reach that point
console.log('After non-existing class')
