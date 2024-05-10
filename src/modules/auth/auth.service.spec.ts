import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findOneWithCondition: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UserService, ConfigService],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign-in', () => {
    it('[Expect Successful]', async () => {
      const signInRequestBody = {
        username: 'string',
        password: 'string',
      };
      const mockResponse = {
        accessToken: 'string',
        refreshToken: 'string',
      };

      const mockUser = {
        id: 1,
        username: 'string',
        fullName: 'string',
        password: 'hash-pwd',
      };

      jest.spyOn(mockUserService, 'findOneWithCondition').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => true);
      jest.spyOn(service, 'signJwt').mockReturnValue(mockResponse.accessToken);

      const res = await service.signIn(signInRequestBody);

      expect(res.accessToken).toEqual(mockResponse.accessToken);
    });

    it('[Expect Error]', async () => {
      const signInRequestBody = {
        username: 'string',
        password: 'string',
      };
      const user = null;

      jest.spyOn(mockUserService, 'findOneWithCondition').mockResolvedValue(user);

      try {
        await service.signIn(signInRequestBody);
      } catch (error) {
        expect(error.status).toEqual(404);
      }
    });
  });
});
