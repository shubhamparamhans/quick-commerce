import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initializeRealtime = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  console.log('Real-time tracking initialized');
};

export const emitOrderStatusUpdate = (orderId: string, status: string) => {
  if (io) {
    io.emit('orderStatusUpdate', { orderId, status });
    console.log(`Order status update emitted for order ${orderId}: ${status}`);
  }
};