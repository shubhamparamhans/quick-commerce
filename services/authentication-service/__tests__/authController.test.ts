import { registerUser, loginUser } from '../controllers/authController';
import User from '../models/user';
import { generateAccessToken } from '../utils/jwt';

jest.mock('../models/user');
jest.mock('../utils/jwt');

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123', role: 'Customer' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.prototype.save as jest.Mock).mockResolvedValue({});

      await registerUser(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { email: 'test@example.com', role: 'Customer' },
      });
    });

    it('should return 409 if user already exists', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123', role: 'Customer' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      await registerUser(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        error: { code: 'RESOURCE_EXISTS', message: 'User already exists' },
      });
    });
  });

  describe('loginUser', () => {
    it('should log in a user successfully', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        _id: 'userId',
        role: 'Customer',
      });
      (generateAccessToken as jest.Mock).mockReturnValue('accessToken');

      await loginUser(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { accessToken: 'accessToken', refreshToken: expect.any(String) },
      });
    });

    it('should return 404 if user is not found', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await loginUser(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
      });
    });
  });
});