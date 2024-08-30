import { TV_REPONSE_INTERFACE } from './contracts';

export class ParseTAResponse {
  public values: number[];

  constructor(indicatorValues: TV_REPONSE_INTERFACE) {
    if (
       !indicatorValues.data ||
       !Array.isArray(indicatorValues.data) ||
       indicatorValues.data.length === 0 ||
       !Array.isArray(indicatorValues.data[0].d)
    ) {
       throw new Error('Invalid data structure');
    }
 
    // Ici, nous filtrons les valeurs nulles de manière à pouvoir travailler avec des tableaux de nombres
    this.values = indicatorValues.data[0].d.filter((value): value is number => value !== null);
 }

  public parse() {
    // Assume initial parsing and calculation methods are available and correct
    return {
      oscillators: {},
      moving_averages: {},
      summary: {},
      indicators: {},
    };
  }
}