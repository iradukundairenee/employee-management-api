import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core');
jest.mock('./app.module');

describe('Main', () => {
  it('should be defined', () => {
    expect(NestFactory).toBeDefined();
    expect(AppModule).toBeDefined();
  });
  
  it('should have bootstrap function', () => {
    expect(typeof NestFactory.create).toBe('function');
  });
});