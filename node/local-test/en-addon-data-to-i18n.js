const args = process.argv.slice(2)
const ref = (args.length > 0) ? args[0] : "master" 

require("../src/addons-data/compile-en")(
	"../ScratchAddons/", 
	"output/i18n/en/addon-data.json"
)