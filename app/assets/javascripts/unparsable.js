/**
 * Example of a script containing a syntax that the browsers
 * does not understand. 
 * 
 * This will display an error in the browser console
 * and not run any code form that module. Code in other `<script>` tag
 * on the page will still execute (but will need to guard against the possibility)
 * of whatever the script was bringing in not to be there.
 */
// The do-expression is not supported anywhere yet
// so browsers will choke when parsing the script
// https://github.com/tc39/proposal-do-expressions
let x = do {
  5 + 3 
}
