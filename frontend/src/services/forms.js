import api from './api';

export const sendEnquiry = (values) => api.post('/enquiries', values).then((r) => r.data);
export const sendWeddingEnquiry = (values) => api.post('/wedding-enquiries', values).then((r) => r.data);
export const subscribe = (values) => api.post('/subscribers', values).then((r) => r.data);
