// import request from 'supertest';
// import app from '../index';
// import mongoose from 'mongoose';

// describe('Warehouse Routes', () => {
//   beforeAll(async () => {
//     const MONGO_URI = 'mongodb://localhost:27017/warehouse-management-test';
//     await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//   });

//   afterAll(async () => {
//     await mongoose.connection.db.dropDatabase();
//     await mongoose.connection.close();
//   });

//   it('should create a new warehouse', async () => {
//     const response = await request(app)
//       .post('/api/warehouses')
//       .send({ name: 'Warehouse A', location: 'Location A' });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('_id');
//     expect(response.body.name).toBe('Warehouse A');
//   });

//   it('should get all warehouses', async () => {
//     const response = await request(app).get('/api/warehouses');

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   it('should get a warehouse by ID', async () => {
//     const warehouse = await request(app)
//       .post('/api/warehouses')
//       .send({ name: 'Warehouse B', location: 'Location B' });

//     const response = await request(app).get(`/api/warehouses/${warehouse.body._id}`);

//     expect(response.status).toBe(200);
//     expect(response.body.name).toBe('Warehouse B');
//   });

//   it('should update a warehouse by ID', async () => {
//     const warehouse = await request(app)
//       .post('/api/warehouses')
//       .send({ name: 'Warehouse C', location: 'Location C' });

//     const response = await request(app)
//       .put(`/api/warehouses/${warehouse.body._id}`)
//       .send({ name: 'Updated Warehouse C' });

//     expect(response.status).toBe(200);
//     expect(response.body.name).toBe('Updated Warehouse C');
//   });

//   it('should delete a warehouse by ID', async () => {
//     const warehouse = await request(app)
//       .post('/api/warehouses')
//       .send({ name: 'Warehouse D', location: 'Location D' });

//     const response = await request(app).delete(`/api/warehouses/${warehouse.body._id}`);

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Warehouse deleted successfully');
//   });
// });