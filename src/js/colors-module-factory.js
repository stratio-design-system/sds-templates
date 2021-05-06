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
const groupInterface = 'Array<NpaColor>';
let groupNames = '';

lineReader.on('line', (line) => {
  if (line.includes('######')) {
    group = line.split('######').pop().trim();
    colors[group] = [];
    groupNames += ` ${group}: ${groupInterface};`;
  }
  if (line.includes(':')) {
    const lineArray = line.split(':');
    const color = lineArray.pop().trim().slice(0, -1).toLowerCase();
    const name = lineArray.shift().slice(1);
    const label = _.startCase(name.slice(5));
    const rgb = [
      parseInt(color.substr(1, 2), 16),
      parseInt(color.substr(3, 2), 16),
      parseInt(color.substr(5, 2), 16)
    ];
    // ###### CMYK Conversion
    let cmyk = rgb.map(e => 1 - (e / 255));
    const k = Math.min(cmyk[0], Math.min(cmyk[1], cmyk[2]));
    cmyk = cmyk.map(e => (e - k) / (1 - k));
    cmyk.push(k);
    cmyk = cmyk.map(e => Math.round(e * 100)).map(e => e || 0);
    // ###### CMYK Conversion - END
    const yiq = ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
    colors[group].push({ name, label, color, rgb, cmyk, yiq });
    colorIdsForInterface += ` ${name}: \'${name}\';`;
    colorIdsForObject += ` ${name}: \'${name}\',`;
  }
});

lineReader.on('close', () => {
  const file = fs.createWriteStream(path.resolve(__dirname, 'ts', 'colors.ts'));
  file.write('export interface NpaColor { name: string; label: string; color: string; rgb: number[]; cmyk: number[]; yiq: number; }');
  file.write(`export interface NpaColorScheme { ${groupNames} }`);
  file.write(`export interface NpaColorNames { ${colorIdsForInterface} }`);
  file.write(`export const npaColorNames: NpaColorNames = { ${colorIdsForObject} };`);
  file.write('export const npaColors: NpaColorScheme = ' + JSON.stringify(colors) + ';');
  file.end();

  console.log('Build done. (Module Colors)');
});
