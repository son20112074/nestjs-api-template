import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGoogleFields1683880928000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "googleId",
      DROP COLUMN IF EXISTS "googleEmail",
      DROP COLUMN IF EXISTS "googleProfile",
      DROP COLUMN IF EXISTS "googleAccessToken",
      DROP COLUMN IF EXISTS "googleRefreshToken"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "googleId" VARCHAR,
      ADD COLUMN IF NOT EXISTS "googleEmail" VARCHAR,
      ADD COLUMN IF NOT EXISTS "googleProfile" JSONB,
      ADD COLUMN IF NOT EXISTS "googleAccessToken" VARCHAR,
      ADD COLUMN IF NOT EXISTS "googleRefreshToken" VARCHAR
    `);
  }
}
