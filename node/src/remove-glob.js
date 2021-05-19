const globby = require("globby")
const chalk = require("chalk")
const fs = require("fs-extra")

module.exports = (folderPath, globPatterns) => {
	console.log(globPatterns.map(pattern => {
		if (pattern.startsWith("!")) return "!" + folderPath + pattern.slice("1")
		return folderPath + pattern
	}))
	const filesToRemove = globby.sync(globPatterns.map(pattern => {
		if (pattern.startsWith("!")) return "!" + folderPath + pattern.slice("1")
		return folderPath + pattern
	}))
	filesToRemove.forEach(file => {
		console.log(chalk`Removing {inverse ${file}}...`)
		fs.removeSync(file)
	})
}