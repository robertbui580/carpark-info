import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sign-in', () => {
    it('[Expect Successful]', async () => {
      const signInRequestBody = {
        username: 'string',
        password: 'string',
      };
      const mockResponse = {
        accessToken: 'string-access-token',
        refreshToken: 'string-refresh-token',
      };

      jest.spyOn(mockAuthService, 'signIn').mockResolvedValue(mockResponse);

      const res = await controller.signIn(signInRequestBody);
      expect(res.accessToken).toEqual(mockResponse.accessToken);
      expect(res.refreshToken).toEqual(mockResponse.refreshToken);
    });
  });
});
