const Profile = require("./profile.js")
const renderer = require("./renderer.js")
const querystring = require('querystring')

function home(request, response) {
  if (request.url === '/') {
    if (request.method.toLowerCase() === 'get') {
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/html')
      renderer.view('header', {}, response)
      renderer.view('search', {}, response)
      renderer.view('footer', {}, response)
      response.end()
    } else {
      request.on('data', postBody => {
        const query = querystring.parse(postBody.toString())
        response.statusCode = 303
        response.setHeader('Location', '/' + query.username)
        response.end()
      })
    }
  }
}

function user(request, response) {
  const username = request.url.replace('/', '')
  if (username.length > 0) {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html')
    renderer.view('header', {}, response)

    const studentProfile = new Profile(username)
    studentProfile.on("end", (profileJSON) => {
      const values = {
        avatarURL: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript,
      }

      renderer.view('profile', values, response)
      renderer.view('footer', {}, response)
      response.end()
    })

    studentProfile.on("error", (error) => {
      renderer.view('error', {errorMessage: error.message}, response)
      renderer.view('search', {}, response)
      renderer.view('footer', {}, response)
      response.end()
    })
  }
}

module.exports.home = home
module.exports.user = user
