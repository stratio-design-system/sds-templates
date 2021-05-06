import { NpaColor, npaColorNames, NpaColorNames, npaColors, NpaColorScheme } from './colors';

export class NpaTemplate {
  public colors: NpaColorScheme;

  private readonly _colorFlatArray: Array<NpaColor> = [];
  private readonly _colorNames: NpaColorNames;
  private readonly _colorNamesArray: Array<string>;

  constructor() {
    this.colors = npaColors;

    for (const group of Object.keys(this.colors)) {
      this._colorFlatArray = [...this._colorFlatArray, ...this.colors[group]];
    }
    this._colorNames = npaColorNames;
    this._colorNamesArray = Object.keys(this._colorNames);
  }

  public getColorByName(colorName: string): NpaColor {
    return this._colorNamesArray.includes(colorName) ?
      this._colorFlatArray.find((e: NpaColor) => e.name === colorName) : null;
  }
}

export const npaTemplate = new NpaTemplate();
