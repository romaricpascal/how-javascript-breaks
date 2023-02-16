/**
 * Just a generic way to log script loading (at least for non-module scripts)
 */
// Module scripts won't have a `currentScript`
// but `import.meta` cannot appear in a non-script module 😭
if (document.currentScript) {
  console.log(document.currentScript.dataset.position, ':', getScriptTagType(document.currentScript), 'script ran')
}

function getScriptTagType(scriptElement) {
  if (scriptElement.hasAttribute('async')) {
    return 'async'
  }

  if (scriptElement.hasAttribute('defer')) {
    return 'defer'
  }

  return 'regular'
}
