const fs = require('fs')

function mergeContent(values, content) {
  for (let key in values) {
    content = content.replace('{{' + key + '}}', values[key])
  }
  return content
}

function view(templateName, values, response) {
  //read from the template file
  let fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'})
  fileContents = mergeContent(values, fileContents)

  //write out the contents to the response
  response.write(fileContents)
}

module.exports.view = view
