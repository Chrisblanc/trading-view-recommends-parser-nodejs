import { ParseTAResponse } from '../src';
import {
  EXCHANGES_ENUM,
  INTERVALS_ENUM,
  SCREENERS_ENUM,
} from '../src/contracts';
import { TradingViewScan } from '../src/main';

describe('response parser', () => {
  it('should handle valid data structure correctly', async () => {
    const result = await new TradingViewScan(
      SCREENERS_ENUM['crypto'],
      EXCHANGES_ENUM['BINANCE'],
      'BNBBUSD',
      INTERVALS_ENUM['1m'],
    ).analyze();
    console.log(result);

    // Assertions pour vérifier que les données sont analysées correctement
    expect(result).toHaveProperty('oscillators');
    expect(result).toHaveProperty('moving_averages');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('indicators');
  });

  it('should throw an error for invalid data structure', async () => {
    try {
      const invalidResponse = { data: [{ s: 'BINANCE:BNBBUSD', d: undefined }] }; // Structure de données incorrecte
      new ParseTAResponse(invalidResponse as any).parse();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid data structure');
    }
  });
});