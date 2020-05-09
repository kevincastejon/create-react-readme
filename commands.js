const Commander = require('commander');

const pkg = require('./package.json');

module.exports = (function Command() {
  const list = (_val) => {
    const val = _val.replace(/[, ]+/g, ',').trim();
    return val.split(',').filter((value) => value.length > 0);
  };

  Commander
    .version(pkg.version)
    .usage('<pkg> <src> <output> [options]')
    .option('-x, --extensions <items>', 'Include only these file extensions. Default: js,jsx', list, ['js', 'jsx'])
    .option('-i, --ignore <items>', 'Folders to ignore. Default: node_modules,__tests__,__mocks__', list, ['node_modules', '__tests__', '__mocks__'])
    .option('-e, --exclude-patterns <items>', 'Filename patterns to exclude. Default: []', list, [])
    .option('-t, --template <file>', 'Handlebars template file for generating the readme file. If not specified it will use the default template', 'template.handlebars')
    .option('-s, --setup <file>', 'Markdown file to include into \'Installation\' section. Default: \'setup_readme.md\'', 'setup_readme.md')
    .option('-u, --usage <file>', 'Markdown file to include into \'Usage\' section. Default: \'usage_readme.md\'', 'usage_readme.md')
    .option('-d, --dev <file>', 'Markdown file to include into \'Developers\' section. Default: \'dev_readme.md\'', 'dev_readme.md')
    .parse(process.argv);


  return Commander;
}());
