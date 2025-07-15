import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { WalletAuthService } from './wallet-auth.service';

interface RequestWithWalletAuth extends Request {
  walletAuth?: {
    walletAddress: string;
    publicKey: string;
  };
}

@Injectable()
export class WalletAuthGuard implements CanActivate {
  constructor(private readonly walletAuthService: WalletAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithWalletAuth>();

    // Extract session token from Authorization header or query parameter
    const sessionToken = this.extractSessionToken(request);

    if (!sessionToken) {
      throw new UnauthorizedException('Session token is required');
    }

    // Validate session token
    const sessionInfo =
      await this.walletAuthService.validateSession(sessionToken);

    if (!sessionInfo) {
      throw new UnauthorizedException('Invalid or expired session token');
    }

    // Add wallet auth info to request object
    request.walletAuth = {
      walletAddress: sessionInfo.walletAddress,
      publicKey: sessionInfo.publicKey,
    };

    return true;
  }

  private extractSessionToken(request: RequestWithWalletAuth): string | null {
    // Try Authorization header first (Bearer token)
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try custom header
    const sessionHeader = request.headers['x-session-token'] as string;
    if (sessionHeader) {
      return sessionHeader;
    }

    // Try query parameter
    const sessionQuery = request.query.sessionToken as string;
    if (sessionQuery) {
      return sessionQuery;
    }

    return null;
  }
}
