# create-react-readme

![npm_version](https://img.shields.io/npm/v/create-react-readme)
![license](https://img.shields.io/npm/l/create-react-readme)

Generate readme.md from your react library

- **[Installation](#install)**
- **[Usage](#usage)**
- **[Developers](#dev)**
- **[CLI API](#api)**


[See on NPM](https://www.npmjs.com/package/create-react-readme)


<a name="install"></a>
## Install

With NPM
```bash
npm i create-react-readme
```

With Yarn
```bash
yarn add create-react-readme
```

Globally
```
npm i create-react-readme -g
```

<a name="dev"></a>
## Developers

```bash
npm run create-react-readme ./package.json ./src/components/ ./readme.md -s ./setup_readme.md -u ./usage_readme.md -d ./dev_readme.md
```

You should create a script on your package.json file like so:

```js
{
  ...
  scripts:{
    ...
    create-readme : "yarn create-react-readme ./package.json ./src/components/ ./readme.md -s ./setup_readme.md -u ./usage_readme.md -d ./dev_readme.md"
  }
}
```
So you can simply call it that way :
```bash
npm run create-readme
```

<a name="api"></a>
## CLI API

Usage: `create-react-readme <pkg> <dir> <output> [options]`

Arguments:

- **pkg** : The package.json file for info extraction
- **src** : The directory containing the components
- **output** : The path and name of the output file

Options:
```
  -h, --help                      output usage information
  -V, --version                   output the version number
  -x, --extensions <items>        Include only these file extensions. Default: js,jsx
  -i, --ignore <items>            Folders to ignore. Default: node_modules,__tests__,__mocks__
  -e, --exclude-patterns <items>  Filename patterns to exclude. Default: []
  -t, --template <file>           Handlebars template file for generating the readme file. If not specified it will use the default template.
  -s, --setup <file>		  Markdown file to include into 'Installation' section.
  -u, --usage <file>		  Markdown file to include into 'Usage' section.
  -d, --dev <file>		  Markdown file to include into 'Developers' section.
```