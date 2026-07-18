export type Category = 'All' | 'Logo' | 'Flyer' | 'Print';

export interface PortfolioItem {
  id: string;
  title: string;
  category: Category;
  imageUrl: string;
  description: string;
  philosophy?: string; // Specifically for Logo category
  philosophyImageUrl?: string; // Image for the brand guideline/philosophy
}
