export type Publisher = {
  id: string;
  name: string;
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
