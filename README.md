# How JavaScript breaks

A little prototype to explore how JavaScript breaks and how different loading methods may help us mitigate impacts on other scripts on the page.

## Running the prototype

After installing with `npm install` run the Prototype Kit server with `npm run dev`.

Navigate to <http://localhost:3000> to be shown a page allowing you to pick different types of errors in the script and different ways to load them.

Open your console to see logs of what got and didn't get run on form submission.

## Files of interest

- Scripts with different kinds of breakage are made available in `app/assets/javascripts`. To add new ones:
  - Add a new JS file in the folder, named in a representative manner
  - Add an entry to the "How should the script break?" [Radios](https://design-system.service.gov.uk/components/radios/) in `index.html`, using the name of the file as value (without extension)

  The `script.html` view adds some shared logging code around the scripts instructions.

- Ways of loading are stored in partials within `app/views/loading-methods`. To add new ones:
  - Add a new partial in the folder, named in representative manned. You get provided a `scriptUrl` variable in the view to access the computed script URL
  - - Add an entry to the "How should the script be loaded" [Radios](https://design-system.service.gov.uk/components/radios/) in `index.html`, using the name of the file as value (without extension)

- View variables for the `index.html` file are computed in a [route](https://prototype-kit.service.gov.uk/docs/create-routes)

- The loaded is script in a custom route as well, allowing to delay its rendering to text what may happen with poor server response.

## Thoughts

> **Note** Some very good news to start with, errors seem pretty contained. Other script tags run, even other events (whether registered in the same script or other script)

### Script tag on page

```html
<script src="<LIBRARY_URL>">
```

The "good old way" of importing a script. You'll likely want a `defer` or `async` to avoid it blocking th DOM while it downloads (unless it's set at the end of the `<body>` tag), but that's it.

That's the starting point we'd like to move away from.

### Module script tag on page

```html
<script type="module" src="<LIBRARY_URL>"></script>
<script type="module">
  // Service code would go here and require the library
  // to expose on `window` the API it allows the service to use
</script>
```

This will:
- make the script only download in browsers supporting `type="module"` on `<script>` tags: https://caniuse.com/es6-module
- ensure the code runs only once, and in order with the other `type="module"` scripts
- ensure it is defered until after the DOM is built
- isolate the code from other scripts, avoiding `var` to colides (but we should move to `const`/`let` anyway)

This will require:
- the library to expose its API on `window` for other `<script>` tags to use
- other scripts requiring the library to also use `type="module"` so they can execute in the right order

### Synchronous import (within module script tag on page) 

```html
<script type="module">
  import "<LIBRARY_URL>";
  // To access the module's content, you'll need 
  // it to have assigned something to `window`
</script>
```

Pretty much the same solution as the one before, except possibly worse as it may break [preload scanning](https://web.dev/preload-scanner/#injected-async-scripts).

Instead of the browser being able to detect the URL as an `src` attribute,
it may have to wait for any DOM preceding the `<script>` to be built before it knows to download the script... for barely any gain. This could be compensated with a [`<link rel="preload">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload). 

> **Note** To be confirmed though, would browsers detect `import` in inline scripts? 🤔

It does allow to have code straight after importing the library though for a quick `.init()` call to start it up. But still requires the library to expose its API on `window` for it to be used.

### Synchronous named import (within module script tag on page) 

```html
<script type="module">
  import * as library from ("<LIBRARY_URL>")
  // You can use `library` directly here
</script>
```

This builds on the previous step, but allows to access the library directly
in the script. That's pretty much it.

### Append a script tag to the DOM

```html
<script>
  var s = document.createElement('script');
  s.src="<LIBRARY_URL>";
  s.onload = function () {
    // Do stuff here
  }
  document.body.appendChild(s)
</script>
```

Asynchronous loading, the "good old way". The advantage is that this can be protected by an `if` to prevent loading.

Not a great option to add some protection, as it is very difficult to synchronise the code using the libary with the library having been loaded.
The scripts following it will execute straight away, and even a `defer` risks running ahead of it as the `DOMContentLoaded` and `load` event will trigger straight after the new `<script>` is added on the page. 

### Asynchronous import – Promise (within module script tag on page) 

```html
<script type="module">
  import("<LIBRARY_URL>")
    .then(function(library) { ... })
</script>
```

or 

```html
<script type="module">
  // Top level await was not availabel at the same time as `import`
  (async function() {
    const module = await import("<LIBRARY_URL>")
  })()
</script>
```

Modules' dynamic import allow to easily coordinate with a module being loaded,
as well as providing direct access to the library once loaded. This version has the lowest browser requirement, cutting at [the support for dynamic import](https://caniuse.com/es6-module-dynamic-import).

And they can be protected with an `if` statement should we want to prevent parsing errors.

> **Note** Check impact on preload parser 🤔 This may require a `preload` (which is counterproductive if trying to prevent running code that won't run by wrapping the `import` in an `if`)

### Asynchronous import – Top level await (within module script tag on page) 

```html
<script type="module">
  const library = await import("<LIBRARY_URL>")
</script>
```

Same as before, but without the wrapping [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), reserving the loading to [browsers supporting `await` at top level of modules](https://caniuse.com/mdn-javascript_operators_await_top_level)

### Protected asynchronous import

```html
<script type="module">
  // Top level await was not available at the same time as `import`
  (async function() {
    // This would be some condition for the library to run
    // likely relying on the presence of specific API in the browser
    const libraryCanRun = 'allSettled' in Promise
    if (libraryCanRun) {
      const library = await import("<LIBRARY_URL>")
    }
  })()
</script>
```

This method prevents the library from loading in browsers that do not support what it requires. `libraryCanRun` would be a check for the presence of one or several APIs matching the browsers supported by the files we ship (not syntaxes, as the script wouldn't parse).

This would require the service code to guard against the library's API not being available if it has code that still need to run even if the library is not available or breaks (custom features, analytics...). We should already advise to guard against this as there's no guarantee the network will let the script download properly.

The gap between `<script type="module">` and whatever APIs and syntaxes are available in a given browser (which would make our code fail to run or parse) is similar to the network failing, so same same.

When it comes to runtime errors triggered later (upon user interactions), I think we just need to ensure that **we don't render new things that may not be interactive as expected**.

```html
<!-- Add flags to hook styles onto to limit layout shifting and such -->
<script>
  document.body.classList.add('js-enabled', 'js-loading');
  if ('noModule' in document.createElement('script')) { document.body.classList.add('js-enhanced') }
</script>
<!-- Load the library and have it expose its content to `window` -->
<script type="module" src="<LIBRARY_URL>"></script>
<!-- 
  Run the app in a separate script to ensure errors in the library's script 
  don't block features that don't rely on the library
-->
<script type="module">
  if (window.LIBRARY) {
    // DO stuff here
  }
</script>
```
