import request from 'supertest';
import app from '../index'; // Assuming the main app file is named index.ts

describe('Product Catalog Service', () => {
  it('should return a list of products', async () => {
    const response = await request(app).get('/v1/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return 404 for a non-existent product', async () => {
    const response = await request(app).get('/v1/products/nonexistent-id');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});