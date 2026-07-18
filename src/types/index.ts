export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  client: string;
  tags: string[];
  description: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  isFeatured: boolean;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Media {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}
