import { Server } from 'socket.io';

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
    });
  });
};

export const emitInventoryUpdate = (warehouseId: string, inventory: any) => {
  if (io) {
    io.to(warehouseId).emit('inventory-update', inventory);
  }
};