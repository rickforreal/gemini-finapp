import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { AssetClass, HistoricalEra } from '@shared';

export interface HistoricalMonth {
  year: number;
  month: number;
  returns: Record<AssetClass, number>;
  cape?: number;
}

let cachedData: HistoricalMonth[] | null = null;

export function loadHistoricalData(): HistoricalMonth[] {
  if (cachedData) return cachedData;

  const csvPath = path.resolve(__dirname, '../../../../data/Historical-Returns.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });

  cachedData = records.map((record: any) => ({
    year: record.Year,
    month: record.Month,
    returns: {
      [AssetClass.STOCKS]: record.Stocks / 100, // CSV is in percentage (e.g. 3.11)
      [AssetClass.BONDS]: record.Bonds / 100,
      [AssetClass.CASH]: record.Cash / 100,
    },
    cape: record.CAPE || undefined,
  }));

  return cachedData!;
}

export function getEraRange(era: HistoricalEra): { startYear: number; endYear: number } {
  switch (era) {
    case HistoricalEra.FULL_HISTORY:
      return { startYear: 1926, endYear: 2024 };
    case HistoricalEra.POST_WAR:
      return { startYear: 1946, endYear: 2024 };
    case HistoricalEra.MODERN_ERA:
      return { startYear: 1980, endYear: 2024 };
    case HistoricalEra.STAGFLATION:
      return { startYear: 1966, endYear: 1982 };
    case HistoricalEra.LOW_YIELD:
      return { startYear: 2008, endYear: 2021 };
    case HistoricalEra.GFC_RECOVERY:
      return { startYear: 2009, endYear: 2019 };
    case HistoricalEra.DOT_COM_CRASH:
      return { startYear: 2000, endYear: 2002 };
    case HistoricalEra.LOST_DECADE:
      return { startYear: 2000, endYear: 2009 };
    default:
      return { startYear: 1926, endYear: 2024 };
  }
}

export function filterDataByEra(data: HistoricalMonth[], era: HistoricalEra): HistoricalMonth[] {
  const { startYear, endYear } = getEraRange(era);
  return data.filter(m => m.year >= startYear && m.year <= endYear);
}
