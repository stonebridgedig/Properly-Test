import { Property } from '@/types';

const API_BASE_URL = 'http://localhost:5255/api';

export const api = {
    properties: {
        getAll: async (): Promise<Property[]> => {
            const response = await fetch(`${API_BASE_URL}/properties`);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            return response.json();
        },
        get: async (name: string): Promise<Property> => {
            const response = await fetch(`${API_BASE_URL}/properties/${name}`);
            if (!response.ok) {
                throw new Error('Failed to fetch property');
            }
            return response.json();
        }
    }
};
