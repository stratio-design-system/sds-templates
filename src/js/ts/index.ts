import { SdsColor, sdsColorNames, SdsColorNames, sdsColors, SdsColorScheme } from './colors';

export class SdsTemplate {
  public colors: SdsColorScheme;

  private readonly _colorFlatArray: Array<SdsColor> = [];
  private readonly _colorNames: SdsColorNames;
  private readonly _colorNamesArray: Array<string>;

  constructor() {
    this.colors = sdsColors;

    for (const group of Object.keys(this.colors)) {
      this._colorFlatArray = [...this._colorFlatArray, ...this.colors[group]];
    }
    this._colorNames = sdsColorNames;
    this._colorNamesArray = Object.keys(this._colorNames);
  }

  public getColorByName(colorName: string): SdsColor {
    return this._colorNamesArray.includes(colorName) ?
      this._colorFlatArray.find((e: SdsColor) => e.name === colorName) : null;
  }
}

export const sdsTemplate = new SdsTemplate();
