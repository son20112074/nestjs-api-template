import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from '../../../shared/decorators/roles.decorator';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  // Profile Information
  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  // Account Status and Security
  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ nullable: true })
  lastFailedLoginAt?: Date;

  // OAuth Information
  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  googleEmail?: string;

  @Column({ type: 'jsonb', nullable: true })
  googleProfile?: {
    name?: string;
    picture?: string;
    locale?: string;
    verifiedEmail?: boolean;
  };

  @Column({ nullable: true })
  googleAccessToken?: string;

  @Column({ nullable: true })
  googleRefreshToken?: string;

  // Timestamps
  @Column({ nullable: true })
  emailVerifiedAt?: Date;

  @Column({ nullable: true })
  passwordChangedAt?: Date;

  @Column({ nullable: true })
  deletedAt?: Date;

  // Computed properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  sanitizeData() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
