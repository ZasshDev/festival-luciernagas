import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../app';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Integration Tests', () => {
  let clientToken: string;
  let adminToken: string;
  let testParkId: string;
  let testUserId: string;

  beforeAll(async () => {
    // Cleanup
    await prisma.reservation.deleteMany();
    await prisma.park.deleteMany();
    await prisma.user.deleteMany();

    // Create client user
    const clientUser = await prisma.user.create({
      data: {
        nombre: 'Test',
        apellidos: 'Client',
        email: 'testclient@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'CLIENT',
      },
    });
    testUserId = clientUser.id;

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        nombre: 'Test',
        apellidos: 'Admin',
        email: 'testadmin@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'ADMIN',
      },
    });

    // Create park
    const park = await prisma.park.create({
      data: {
        nombre: 'Test Park',
        direccion: '123 Test St',
        servicios: 'Baños',
        horario: '08:00 - 18:00',
        hasCabins: true,
        stockCabanas: 1,
        lat: 19.0,
        lng: -98.0,
      },
    });
    testParkId = park.id;

    const secret = process.env.JWT_SECRET || 'secret';
    clientToken = jwt.sign({ userId: clientUser.id, role: 'CLIENT' }, secret, { expiresIn: '1h' });
    adminToken = jwt.sign({ userId: adminUser.id, role: 'ADMIN' }, secret, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Auth Routes', () => {
    it('201 with valid data on register', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nombre: 'New',
        apellidos: 'User',
        email: 'newuser@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
    });

    it('400 if email already registered', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nombre: 'Another',
        apellidos: 'User',
        email: 'testclient@example.com', // Already seeded
        password: 'password123',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already registered');
    });

    it('400 if password too short', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nombre: 'Short',
        apellidos: 'Pass',
        email: 'short@example.com',
        password: '123',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });
  });

  describe('Reservation Routes', () => {
    it('201 on valid reservation (Monday-Wednesday, June)', async () => {
      // 2026-06-17 is Wednesday, 2026-06-19 is Friday (No Tuesdays)
      const res = await request(app)
        .post('/api/reservations')
        .set('Cookie', [`token=${clientToken}`])
        .send({
          parkId: testParkId,
          fechaInicio: '2026-06-17T10:00:00Z',
          fechaFin: '2026-06-19T10:00:00Z',
          numPersonas: 2,
          tipo: 'CABIN',
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
    });

    it('400 if fechaInicio falls on Tuesday', async () => {
      // 2026-06-09 is Tuesday
      const res = await request(app)
        .post('/api/reservations')
        .set('Cookie', [`token=${clientToken}`])
        .send({
          parkId: testParkId,
          fechaInicio: '2026-06-09T10:00:00Z',
          fechaFin: '2026-06-10T10:00:00Z',
          numPersonas: 2,
          tipo: 'CAMPING',
        });
      expect(res.status).toBe(400);
    });

    it('400 if any day in range is Tuesday', async () => {
      // 2026-06-08 (Mon) to 2026-06-10 (Wed) includes Tuesday
      const res = await request(app)
        .post('/api/reservations')
        .set('Cookie', [`token=${clientToken}`])
        .send({
          parkId: testParkId,
          fechaInicio: '2026-06-08T10:00:00Z',
          fechaFin: '2026-06-10T10:00:00Z',
          numPersonas: 2,
          tipo: 'CAMPING',
        });
      expect(res.status).toBe(400);
    });

    it('400 if dates outside festival period', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .set('Cookie', [`token=${clientToken}`])
        .send({
          parkId: testParkId,
          fechaInicio: '2026-05-01T10:00:00Z',
          fechaFin: '2026-05-03T10:00:00Z',
          numPersonas: 2,
          tipo: 'CAMPING',
        });
      expect(res.status).toBe(400);
    });

    it('409 if overlapping reservation exists for same park/type', async () => {
      // We already booked 2026-06-17 to 2026-06-19, try overlapping
      const res = await request(app)
        .post('/api/reservations')
        .set('Cookie', [`token=${clientToken}`])
        .send({
          parkId: testParkId,
          fechaInicio: '2026-06-18T10:00:00Z',
          fechaFin: '2026-06-20T10:00:00Z',
          numPersonas: 2,
          tipo: 'CABIN',
        });
      expect(res.status).toBe(409);
    });

    it('401 if no token provided', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .send({
          parkId: testParkId,
          fechaInicio: '2026-06-20T10:00:00Z',
          fechaFin: '2026-06-22T10:00:00Z',
          numPersonas: 2,
          tipo: 'CAMPING',
        });
      expect(res.status).toBe(401);
    });

    it('403 if token belongs to ADMIN role', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .set('Cookie', [`token=${adminToken}`])
        .send({
          parkId: testParkId,
          fechaInicio: '2026-06-20T10:00:00Z',
          fechaFin: '2026-06-22T10:00:00Z',
          numPersonas: 2,
          tipo: 'CAMPING',
        });
      expect(res.status).toBe(403);
    });
  });
});
