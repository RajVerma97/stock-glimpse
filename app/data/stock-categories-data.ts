import { StockCategoriesList } from '../enums/stock-categories-list.enum'
import { StockCategoryKeys } from '../types/stock-categories'

export const StockCategoriesData: Record<StockCategoryKeys, string[]> = {
  [StockCategoriesList.TECHNOLOGY]: ['AAPL', 'MSFT', 'IBM', 'AMZN', 'GOOGL', 'TSLA', 'ORCL', 'NVDA', 'AMD', 'INTC'],

  [StockCategoriesList.FINANCE]: ['JPM', 'GS', 'BAC', 'C', 'MS', 'WFC', 'SCHW', 'BLK', 'AXP', 'PYPL'],

  [StockCategoriesList.HEALTHCARE]: ['JNJ', 'PFE', 'MRK', 'LLY', 'UNH', 'MDT', 'BMY'],

  [StockCategoriesList.ENERGY]: ['XOM', 'CVX', 'COP', 'SLB', 'OXY', 'PSX'],

  [StockCategoriesList.CONSUMER_DISCRETIONARY]: ['AMZN', 'TSLA', 'HD', 'NKE', 'LOW', 'SBUX', 'MCD', 'YUM', 'EBAY'],

  // New Categories
  [StockCategoriesList.CONSUMER_STAPLES]: ['PG', 'KO', 'PEP', 'WMT', 'COST', 'COKE', 'CL'],

  [StockCategoriesList.UTILITIES]: ['NEE', 'DUK', 'SO', 'D', 'EXC', 'AEP', 'SRE', 'PPL'],

  [StockCategoriesList.MATERIALS]: ['LIN', 'NEM', 'FCX', 'APD', 'DD', 'MOS', 'VMC'],

  [StockCategoriesList.INDUSTRIALS]: ['BA', 'GE', 'CAT', 'HON', 'LMT', 'MMM', 'UTX', 'MRK', 'SPG'],

  [StockCategoriesList.REAL_ESTATE]: ['AMT', 'PLD', 'CCI', 'SPG', 'EQIX', 'DLR', 'O', 'VTR', 'ARE'],

  [StockCategoriesList.TELECOMMUNICATIONS]: ['T', 'VZ', 'TMUS', 'CHTR', 'DISH', 'S', 'CMCSA', 'CTSH'],

  [StockCategoriesList.AGRICULTURE]: ['ADM', 'BG', 'CAG', 'SYT', 'DE', 'MON', 'KHC', 'CORN'],

  [StockCategoriesList.AEROSPACE]: ['NOC', 'LMT', 'GD', 'BA', 'RTX', 'HII', 'SPR', 'AER'],
}
