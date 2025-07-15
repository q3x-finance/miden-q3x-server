import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';

interface RequestWithAnalytics extends Request {
  startTime?: number;
  sessionId?: string;
  userAddress?: string;
}

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AnalyticsMiddleware.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  use(req: RequestWithAnalytics, res: Response, next: NextFunction) {
    // Skip analytics endpoints to avoid infinite loops
    if (req.path.startsWith('/analytics')) {
      return next();
    }

    // Skip health check endpoints
    if (req.path.includes('/health')) {
      return next();
    }

    const startTime = Date.now();
    req.startTime = startTime;

    // Extract session ID from headers or query
    const sessionId =
      (req.headers['x-session-id'] as string) ||
      (req.query.sessionId as string);
    if (sessionId) {
      req.sessionId = sessionId;
    }

    // Extract user address from headers or auth
    const userAddress =
      (req.headers['x-user-address'] as string) || (req as any).user?.address;
    if (userAddress) {
      req.userAddress = userAddress;
    }

    // Track the request when response finishes
    res.on('finish', () => {
      this.trackEndpointCall(req, res, startTime);
    });

    next();
  }

  private async trackEndpointCall(
    req: RequestWithAnalytics,
    res: Response,
    startTime: number,
  ) {
    try {
      const responseTime = Date.now() - startTime;
      const endpoint = this.normalizeEndpoint(req.path);
      const method = req.method;
      const statusCode = res.statusCode;
      const ipAddress = req.ip || req.connection.remoteAddress;

      let errorDetails = null;
      if (statusCode >= 400) {
        errorDetails = {
          statusCode,
          method,
          endpoint: req.path,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString(),
        };
      }

      await this.analyticsService.trackEndpointCall(
        endpoint,
        method,
        responseTime,
        statusCode,
        req.userAddress,
        req.sessionId,
        ipAddress,
        errorDetails,
      );

      // Update session activity if session exists
      if (req.sessionId) {
        await this.analyticsService.updateSessionActivity(
          req.sessionId,
          req.userAddress,
        );
      }
    } catch (error) {
      this.logger.error('Failed to track endpoint call:', error);
    }
  }

  private normalizeEndpoint(path: string): string {
    // Replace dynamic segments with placeholders
    return path
      .replace(/\/\d+/g, '/:id') // Replace numeric IDs
      .replace(/\/0x[a-fA-F0-9]+/g, '/:address') // Replace addresses
      .replace(/\/[a-zA-Z0-9-_]{16,}/g, '/:token') // Replace tokens/codes
      .replace(/\/[a-fA-F0-9-]{36}/g, '/:uuid'); // Replace UUIDs
  }
}
