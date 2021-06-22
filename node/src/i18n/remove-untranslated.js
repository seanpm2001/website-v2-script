const fs = require("fs-extra")
const globby = require("globby")
const path = require("path")
const chalk = require("chalk")
const yaml = require("yaml")
// const scmp = require("scmp")

const removeSimilarEntries = (objectTarget, objectReference) => {

	Object.keys(objectReference).forEach(keys => {
		if (!objectTarget[keys]) return
		if (typeof objectReference[keys] === "object") {
			objectTarget[keys] = removeSimilarEntries(objectTarget[keys], objectReference[keys])
			if (Object.keys(objectTarget[keys]).length === 0) delete objectTarget[keys]
		}
		else if (objectTarget[keys] === objectReference[keys]) delete objectTarget[keys]
	})
	return objectTarget

}

module.exports = (i18nLanguageDirPath, eni18nLanguageDirPath, options = {}) => {

	let languageCode = options.languageCode || path.basename(i18nLanguageDirPath)

	console.log(chalk`Removing untranslated files on {inverse ${languageCode}}...`)

	let globPatterns = options.globPatterns || ["**"]

	const files = globby.sync(globPatterns.map(pattern => eni18nLanguageDirPath + pattern))

	files.forEach(file => {

		let filePath = file.replace(eni18nLanguageDirPath, "")

		if (!fs.existsSync(i18nLanguageDirPath + filePath)) return

		if (filePath === "hugo-i18n.yml") {

			let result = removeSimilarEntries(
				yaml.parse(fs.readFileSync(i18nLanguageDirPath + "hugo-i18n.yml", "utf-8")),
				yaml.parse(fs.readFileSync(eni18nLanguageDirPath + "hugo-i18n.yml", "utf-8"))
			)

			if (Object.keys(result).length) fs.writeFileSync(i18nLanguageDirPath + "hugo-i18n.yml", yaml.stringify(result))
			else fs.writeFileSync(i18nLanguageDirPath + "hugo-i18n.yml", "")

		} else {

			if (fs.readFileSync(eni18nLanguageDirPath + filePath, "utf-8").trim() === fs.readFileSync(i18nLanguageDirPath + filePath, "utf-8").trim()) {
				console.log(chalk`{inverse ${i18nLanguageDirPath}${filePath}} is similar. Removing...`)
				fs.removeSync(i18nLanguageDirPath + filePath)
			} else {
				// console.log(i18nLanguageDirPath + filePath + " is different")
			}
	
			// if (scmp(fs.readFileSync(eni18nLanguageDirPath + filePath), fs.readFileSync(i18nLanguageDirPath + filePath))) {
			// 	console.log(filePath + " is similar")
			// } else {
			// 	console.log(filePath + " is different")
			// }

		}

	})

}

