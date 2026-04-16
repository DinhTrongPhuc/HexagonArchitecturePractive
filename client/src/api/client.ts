import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:5000', // port của server
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

export interface EmailLink {
    text: string;
    href: string;
}

export interface ScannedSupportTicket {
    id: string;
    conversationId?: string;
    subject: string;
    bodyPreview: string;
    bodyContent?: string;
    webLink?: string;
    receivedAt?: string;
    senderName?: string;
    senderAddress?: string;
    isRead?: boolean;
    links: EmailLink[];
    matchedQuery: string;
}

export interface ScanSupportTicketsResponse {
    searchPhrase: string;
    total: number;
    tickets: ScannedSupportTicket[];
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
    },
    getTags: async () => {
        const res = await apiClient.get<string[]>('/notes/meta/tags');
        return res.data;
    }
};

export const allocationApi = {
    allocate: async (payload: { leadId: string, dryRun: boolean, crmVersion?: string }) => {
        const res = await apiClient.post<{ logs: string[] }>('/allocate', payload);
        return res.data;
    }
};

export const supportTicketsApi = {
    scan: async (params?: { searchPhrase?: string; limit?: number }) => {
        const res = await apiClient.get<ScanSupportTicketsResponse>('/support-tickets/scan', { params });
        return res.data;
    },
    startAuto: async () => {
        const res = await apiClient.post<{ success: boolean; message: string }>('/support-tickets/auto/start');
        return res.data;
    },
    stopAuto: async () => {
        const res = await apiClient.post<{ success: boolean; message: string }>('/support-tickets/auto/stop');
        return res.data;
    },
    getAutoStatus: async () => {
        const res = await apiClient.get<{ isScanning: boolean }>('/support-tickets/auto/status');
        return res.data;
    }
};
