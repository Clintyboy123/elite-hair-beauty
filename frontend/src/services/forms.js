import api from './api';
import { site } from '../content/site';
import { IS_PREVIEW } from '../utils/asset';

// The GitHub Pages preview has no backend, so the forms say so plainly instead of failing with a network error.
const previewOnly = () => {
  const error = new Error(`This is a preview of the new website, so forms aren't sent yet. Please email ${site.email} or call ${site.phone}.`);
  error.status = 0;
  error.fields = {};
  return Promise.reject(error);
};

const post = (path) => (values) => (IS_PREVIEW ? previewOnly() : api.post(path, values).then((r) => r.data));

export const sendEnquiry = post('/enquiries');
export const sendWeddingEnquiry = post('/wedding-enquiries');
export const subscribe = post('/subscribers');
