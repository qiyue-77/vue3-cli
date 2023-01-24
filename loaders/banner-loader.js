const schema = require('./schema.json')
module.exports = function (content) {
  //追加作者附属名
  const options = this.getOptions(schema)
  const prefix =
    `
  author:${options.author}
  `
  return prefix + content
}