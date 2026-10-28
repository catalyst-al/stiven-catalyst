const { chromium } = require('$SRC/node_modules/playwright');
module.exports.launch = (opts={}) => chromium.launch({ executablePath: '/opt/pw-browsers/chromium', ...opts });
