module.exports = function (content) {
  //清除log打印
  return content.replace(/console\.log\(.*\);?/g, "")
}