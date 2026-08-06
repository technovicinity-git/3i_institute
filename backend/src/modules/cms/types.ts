export interface CreatePageInput {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface UpdatePageInput {
  title?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  expiresAt?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}
