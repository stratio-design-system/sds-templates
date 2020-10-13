const fs = require('fs');
const path = require('path');
const readline = require('readline');
const _ = require('lodash');
const dotEnv = require('dotenv');

dotEnv.config();

// ###### CHECK INTERNAL IMPORTS:
let _colorsModuleSrc = `../style/templates/${process.env.TEMPLATE}/backroom/exportable/_app.colors.scss`;
const _importsModuleSrc = `../style/templates/${process.env.TEMPLATE}/imports.js`;
if (fs.existsSync(path.resolve(__dirname, _importsModuleSrc))) {
  const imports = require(path.resolve(__dirname, _importsModuleSrc));
  _colorsModuleSrc = `../style/templates/${imports.colors}/backroom/exportable/_app.colors.scss`;
}

const filePath = path.resolve(__dirname, _colorsModuleSrc);
const lineReader = readline.createInterface({
  input: fs.createReadStream(filePath)
});

const colors = {};
let group = '';
let colorIdsForInterface = '';
let colorIdsForObject = '';
const groupInterface = 'Array<SdsColor>';
let groupNames = '';

lineReader.on('line', (line) => {
  if (line.includes('######')) {
    group = line.split('######').pop().trim();
    colors[group] = [];
    groupNames += ` ${group}: ${groupInterface};`;
  }
  if (line.includes(':')) {
    const lineArray = line.split(':');
    const color = lineArray.pop().trim().slice(0, -1);
    const name = lineArray.shift().slice(1);
    const label = _.startCase(name.slice(5));
    colors[group].push({ name, label, color });
    colorIdsForInterface += ` ${name}: \'${name}\';`;
    colorIdsForObject += ` ${name}: \'${name}\',`;
  }
});

lineReader.on('close', () => {
  const file = fs.createWriteStream(path.resolve(__dirname, 'ts', 'colors.ts'));
  file.write('export interface SdsColor { name: string; label: string; color: string; }');
  file.write(`export interface SdsColorScheme { ${groupNames} }`);
  file.write(`export interface SdsColorNames { ${colorIdsForInterface} }`);
  file.write(`export const sdsColorNames: SdsColorNames = { ${colorIdsForObject} };`);
  file.write('export const sdsColors: SdsColorScheme = ' + JSON.stringify(colors) + ';');
  file.end();

  console.log('Build done. (Module Colors)');
});
