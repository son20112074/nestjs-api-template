import { ExecutionContext, Type } from '@nestjs/common';
import { HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { Role } from '../shared/decorators/roles.decorator';

export const mockJwtAuthGuard = {
  canActivate: () => true,
  handleRequest: (err: any, user: any) => user,
};

export const mockRolesGuard = {
  canActivate: () => true,
};

export const mockRequest = {
  user: {
    id: '1',
    email: 'test@example.com',
    roles: [Role.ADMIN],
  },
};

export class MockExecutionContext implements ExecutionContext {
  getType<TContext extends string = string>(): TContext {
    return 'http' as TContext;
  }

  getHandler<TFunction extends Function = Function>(): TFunction {
    return (() => {}) as unknown as TFunction;
  }

  getClass<TClass extends Type<any> = Type<any>>(): TClass {
    return class {} as TClass;
  }

  switchToHttp(): HttpArgumentsHost {
    return {
      getRequest: <T = any>() => mockRequest as T,
      getResponse: <T = any>() => ({}) as T,
      getNext: <T = any>() => (() => {}) as T,
    };
  }

  switchToRpc(): RpcArgumentsHost {
    return {
      getContext: <T = any>() => ({}) as T,
      getData: <T = any>() => ({}) as T,
    };
  }

  switchToWs(): WsArgumentsHost {
    return {
      getClient: <T = any>() => ({}) as T,
      getData: <T = any>() => ({}) as T,
      getPattern: <T = any>() => ({}) as T,
    };
  }

  getArgs<T extends any[] = any[]>(): T {
    return [] as T;
  }

  getArgByIndex<T = any>(index: number): T {
    return {} as T;
  }
}

export const mockExecutionContext = new MockExecutionContext(); 