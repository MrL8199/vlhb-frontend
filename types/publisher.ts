export type Publisher = {
  id: string;
  name: string;
  created_at: number;
};

export interface AddPublisher {
  name: string;
}

export interface PublishersData {
  publishers: Publisher[];
  total: number;
}

export interface AddPublisherData {
  publisher: Publisher;
}
