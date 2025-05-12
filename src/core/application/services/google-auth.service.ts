import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { TokenResponseDto } from '../../../interfaces/dtos/auth/token.dto';

@Injectable()
export class GoogleAuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: this.configService.get('google.clientId'),
      clientSecret: this.configService.get('google.clientSecret'),
    });
  }

  async validateGoogleToken(idToken: string): Promise<TokenResponseDto> {
    try {
      // Verify the Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get('google.clientId'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new BadRequestException('Invalid Google token payload');
      }

      // Extract user information from Google payload
      const {
        sub: googleId,
        email,
        email_verified: emailVerified,
        given_name: firstName,
        family_name: lastName,
        picture: avatarUrl,
        locale,
      } = payload;

      // Find existing user by Google ID or email
      let user = await this.userService.findByGoogleId(googleId);
      if (!user) {
        user = await this.userService.findByEmail(email);
      }

      if (user) {
        // Update existing user with Google information
        user = await this.userService.update(user.id, {
          googleId,
          googleEmail: email,
          googleProfile: {
            name: `${firstName} ${lastName}`,
            picture: avatarUrl,
            locale,
            verifiedEmail: emailVerified,
          },
          isEmailVerified: emailVerified || user.isEmailVerified,
          lastLoginAt: new Date(),
        });
      } else {
        // Create new user
        user = await this.userService.create({
          email,
          firstName,
          lastName,
          googleId,
          googleEmail: email,
          googleProfile: {
            name: `${firstName} ${lastName}`,
            picture: avatarUrl,
            locale,
            verifiedEmail: emailVerified,
          },
          isEmailVerified: emailVerified,
          isActive: true,
          avatarUrl,
          lastLoginAt: new Date(),
        });
      }

      // Generate JWT tokens
      return this.authService.generateTokens(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
