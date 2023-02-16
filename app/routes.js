//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const { URLSearchParams } = require('url')
const router = govukPrototypeKit.requests.setupRouter()

// Add search params to the locals available in the views
router.use(function (request, response, next) {
  response.locals.params = new URLSearchParams(request.query);
  next()
})

// Add your routes here
