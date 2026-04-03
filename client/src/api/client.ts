import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
});

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    reporter: string;
    createdAt: string;
    updateAt: string;
}

export const notesApi = {
    getAll: async (params?: { page?: number; limit?: number; tag?: string }) => {
        const res = await apiClient.get<{ data: Note[], total: number, limit: number, skip: number }>('/notes', { params });
        return res.data;
    },
    create: async (payload: { title: string; content: string; tags: string[]; reporter: string }) => {
        const res = await apiClient.post<Note>('/notes', payload);
        return res.data;
    },
    update: async (id: string, payload: { title: string; content: string; tags: string[]; reporter: string }) => {
        const res = await apiClient.put<Note>(`/notes/${id}`, payload);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await apiClient.delete(`/notes/${id}`);
        return res.data;
    }
};
