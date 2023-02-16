//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const {readFile, stat} = require('node:fs/promises');

const govukPrototypeKit = require('govuk-prototype-kit')
const { URLSearchParams } = require('url')
const router = govukPrototypeKit.requests.setupRouter()

// Allows to customise render a script with a specific delay
router.get('/:scriptName.js', async function (request, response) {
  const scriptPath = `app/assets/javascripts/${request.params.scriptName}.js`;
  const delay = request.query.delay || '0'; // String for consistency with other handler

  try {
    response.setHeader('Content-Type', 'application/javascript');
    response.locals.scriptContent = await readFile(scriptPath)

    response.locals.renderExportStatements = request.query.export_statements !== 'false' 

    setTimeout(function() {
      response.render('script.html');
    }, delay)
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.sendStatus(404)
    } else {
      throw error;
    }
  }
})

router.get('/', function (request, response) {
  
  const loadingMethod = request.query.loading_method || 'script-tag'
  const loadingPartial = `./loading-methods/_${loadingMethod}.html`

  const script = request.query.script || 'no-error'
  const delay = request.query.delay || '0' // String so it renders properly

  const scriptOptions = new URLSearchParams();
  scriptOptions.set('delay', delay)
  // Simple script tags won't like `export` in the `script.html` view
  // so we set a little flag to not put them
  if (loadingMethod === 'script-tag') {
    scriptOptions.set('export_statements', 'false')
  }
  const scriptUrl = `/${script}.js?${scriptOptions}`

  // Make them available to the template
  Object.assign(response.locals,{
    script,
    delay,
    scriptUrl,
    loadingMethod,
    loadingPartial,
  })

  response.render('index.html')
})

// Add your routes here
