```bash
yarn create-react-readme ./package.json ./src/components/ ./readme.md -s ./setup_readme.md -u ./usage_readme.md -d ./dev_readme.md
```
or
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
yarn create-readme
```