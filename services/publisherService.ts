import { AddPublisher, PublishersData, Publisher, AddPublisherData } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

const getPublishers = async (): Promise<PublishersData> => {
  try {
    const { data } = await apiClient.get(`/publishers`);
    if (!data.status) throw new Error(data.message);

    const publishersData: PublishersData = {
      publishers: data.data,
      total: data.data.length,
    };

    return publishersData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const addPublisher = async (publisher: AddPublisher): Promise<AddPublisherData> => {
  try {
    const url = '/publishers';
    const { data } = await apiClient.post(url, publisher);
    if (!data.status) throw new Error(data.message);
    return {
      publisher: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const updatePublisher = async (publisher: Publisher): Promise<AddPublisherData> => {
  try {
    const url = `/publishers/${publisher.id}`;
    const { data } = await apiClient.put(url, publisher);
    if (!data.status) throw new Error(data.message);
    return {
      publisher: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const deletePublisher = async (id: string): Promise<void> => {
  const url = `/publishers/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchPublisher = async (id: string): Promise<Publisher> => {
  try {
    const url = `/publishers/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const publisherData: Publisher = {
      id: data.data.id,
      name: data.data.name,
      created_at: data.data.created_at,
    };

    return publisherData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const PublisherService = {
  getPublishers,
  updatePublisher,
  deletePublisher,
  addPublisher,
  fetchPublisher,
};
