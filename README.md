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
