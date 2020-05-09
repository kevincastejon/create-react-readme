#!/usr/bin/env node

const { parse, resolver } = require('react-docgen');
const fs = require('fs');
const path = require('path');
const { readFiles } = require('node-dir');
const Handlebars = require('handlebars');
const Colors = require('colors');
const Table = require('cli-table');
const Entities = require('html-entities').XmlEntities;
const Command = require('./commands');
const pkg = require('./package.json');

const entities = new Entities();

const table = new Table({
  head: [
    Colors.cyan('Path'),
    Colors.cyan('Components'),
    Colors.cyan('Status'),
  ],
});

Handlebars.registerHelper('inc', (value) => parseInt(value, 10) + 1);

console.log(Colors.white(`\n\nREACT DOC GENERATOR v${pkg.version}`));
console.log(Colors.white('by Kevin Castejon <contact@kevincastejon.fr>'));

if (Command.args.length !== 3) {
  console.log(`${Colors.red('Please specify <pkg> <dir> <output> in that order!')}`);
} else if (!fs.existsSync(Command.args[0])) {
  console.log(`${Colors.red(`Specified package.json file does not exist. ${Command.args[0]}`)}`);
} else if (!fs.existsSync(Command.args[1])) {
  console.log(`${Colors.red(`Specified source path does not exist. ${Command.args[0]}`)}`);
} else {
  const userpkg = JSON.parse(fs.readFileSync(Command.args[0]));
  const output = fs.createWriteStream(Command.args[2], 'utf8');
  const isSetupFile = fs.existsSync(Command.setup);
  const isUsageFile = fs.existsSync(Command.usage);
  const isDevFile = fs.existsSync(Command.dev);
  if (!isSetupFile) {
    console.log(`${Colors.red('Specified setup file cannot be found, it will be ignored!')}`);
  }
  if (!isUsageFile) {
    console.log(`${Colors.red('Specified usage file cannot be found, it will be ignored!')}`);
  }
  if (!isDevFile) {
    console.log(`${Colors.red('Specified dev file cannot be found, it will be ignored!')}`);
  }
  const templateData = {
    files: [],
    version: pkg.version,
    userPkg: userpkg,
    setupFile: isSetupFile ? fs.readFileSync(Command.setup, 'utf8') : null,
    usageFile: isUsageFile ? fs.readFileSync(Command.usage, 'utf8') : null,
    devFile: isDevFile ? fs.readFileSync(Command.dev, 'utf8') : null,
  };
  const template = Handlebars.compile(`${fs.readFileSync(Command.template === 'template.handlebars' ? path.join(__dirname, 'template.handlebars') : Command.template)}`);

  readFiles(
    Command.args[1],
    {
      match: new RegExp(`\\.(?:${Command.extensions.join('|')})$`),
      exclude: Command.excludePatterns,
      excludeDir: Command.ignore,
    },
    (err, content, filename, next) => {
      if (err) {
        throw err;
      }
      try {
        let components = parse(content, resolver.findAllExportedComponentDefinitions);
        components = components.map((_component) => {
          const component = _component;
          if (component.description && !component.displayName) {
            const index = 0;
            component.title = component.description.match(/^(.*)$/m)[index];
            if (component.description.split('\n').length > 1) {
              component.description = component.description.replace(/[\w\W]+?\n+?/, '');
              component.description = component.description.replace(/(\n)/gm, '   \n');
            } else {
              component.description = null;
            }
          } else {
            component.title = component.displayName;
          }

          if (component.description) {
            component.description = `${component.description}   \n\n`;
          }

          // validate default values
          if (component.props) {
            Object.keys(component.props).forEach((key) => {
              const obj = component.props[key];
              if (obj.defaultValue) {
                const isString = obj.type.name === 'string'
                                    && typeof obj.defaultValue.value === 'string';
                const isInvalidValue = (/[^\w\s.&:\-+*,!@%$]+/igm).test(obj.defaultValue.value);
                if (isInvalidValue && !isString) {
                  obj.defaultValue.value = '<See the source code>';
                }
              }
              if (obj.description) {
                const processedDescription = obj.description
                  .split('\n')
                  .map((text) => text.replace(/(^\s+|\s+$)/, ''))
                  .map((hasValidValue) => hasValidValue)
                  .join(' ');
                obj.description = processedDescription;
              }
            });
          }

          return component;
        });
        templateData.files.push({ filename, components });
        table.push([
          filename,
          components.length,
          Colors.green('OK.'),
        ]);
      } catch (e) {
        table.push([
          filename,
          0,
          Colors.red('You have to export at least one valid React Class!'),
        ]);
      }

      next();
    },
    (err) => {
      if (err) {
        throw err;
      }

      if (templateData.files.length === 0) {
        const extensions = Command.extensions.map((ext) => `\`*.${ext}\``);
        console.log(`${Colors.bold.yellow('Warning:')} ${Colors.yellow(`Could not find any files matching the file type: ${extensions.join(' OR ')}`)}\n`);
      } else {
        console.log(`${table.toString()}\n\n`);
      }
      output.write(entities.decode(template(templateData)));
    },
  );
}
