import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationsts1752640295165 implements MigrationInterface {
  name = '1752640276700Migrations.ts1752640295165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."wallet_auth_keys_status_enum" AS ENUM('active', 'revoked', 'expired')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."wallet_auth_keys_device_type_enum" AS ENUM('desktop', 'mobile', 'tablet', 'unknown')
        `);
    await queryRunner.query(`
            CREATE TABLE "wallet_auth_keys" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "wallet_address" character varying NOT NULL,
                "public_key" character varying NOT NULL,
                "hashed_secret_key" character varying NOT NULL,
                "key_derivation_salt" character varying,
                "status" "public"."wallet_auth_keys_status_enum" NOT NULL DEFAULT 'active',
                "last_used_at" TIMESTAMP,
                "expires_at" TIMESTAMP NOT NULL,
                "device_fingerprint" character varying,
                "device_type" "public"."wallet_auth_keys_device_type_enum" NOT NULL DEFAULT 'unknown',
                "user_agent" character varying,
                "ip_address" character varying,
                "metadata" jsonb,
                CONSTRAINT "UQ_bef196ffd7feeb31b48ffe644f0" UNIQUE ("public_key"),
                CONSTRAINT "PK_862e76e3b48730df6cf750b0dfb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_64f608d78b3d85a67287f77298" ON "wallet_auth_keys" ("wallet_address")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_dd314e6fba34f5ffa1f2ff9f92" ON "wallet_auth_keys" ("created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_bef196ffd7feeb31b48ffe644f" ON "wallet_auth_keys" ("public_key")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_82f27d8cc4c2b2d2c7f1c977fa" ON "wallet_auth_keys" ("wallet_address", "status")
        `);
    await queryRunner.query(`
            CREATE TABLE "wallet_auth_sessions" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "session_token" character varying NOT NULL,
                "wallet_address" character varying NOT NULL,
                "auth_key_id" integer NOT NULL,
                "expires_at" TIMESTAMP NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "last_activity_at" TIMESTAMP,
                "ip_address" character varying,
                "user_agent" character varying,
                "session_data" jsonb,
                CONSTRAINT "UQ_d4fc33e5a4ff0f44b46745d6044" UNIQUE ("session_token"),
                CONSTRAINT "PK_619bd16f69a9477f9c236e95fda" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_90d2b00146d157c4b8a9f8a038" ON "wallet_auth_sessions" ("auth_key_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_d4fc33e5a4ff0f44b46745d604" ON "wallet_auth_sessions" ("session_token")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_718711db1f248f3dcfe7062255" ON "wallet_auth_sessions" ("wallet_address", "is_active")
        `);
    await queryRunner.query(`
            CREATE TABLE "wallet_auth_challenges" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "wallet_address" character varying NOT NULL,
                "challenge_code" character varying NOT NULL,
                "expected_response" character varying NOT NULL,
                "expires_at" TIMESTAMP NOT NULL,
                "is_used" boolean NOT NULL DEFAULT false,
                "ip_address" character varying,
                "user_agent" character varying,
                "challenge_data" jsonb,
                CONSTRAINT "UQ_25c1f7c632c9ca51cfed1a7ce14" UNIQUE ("challenge_code"),
                CONSTRAINT "PK_3926d74440fa62e0cc79b74fe01" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_aa929b5be00a79298d8fa71820" ON "wallet_auth_challenges" ("created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_25c1f7c632c9ca51cfed1a7ce1" ON "wallet_auth_challenges" ("challenge_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_b9c58636b9387e2f3d41a950d3" ON "wallet_auth_challenges" ("wallet_address", "is_used")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_b9c58636b9387e2f3d41a950d3"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_25c1f7c632c9ca51cfed1a7ce1"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_aa929b5be00a79298d8fa71820"
        `);
    await queryRunner.query(`
            DROP TABLE "wallet_auth_challenges"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_718711db1f248f3dcfe7062255"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d4fc33e5a4ff0f44b46745d604"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_90d2b00146d157c4b8a9f8a038"
        `);
    await queryRunner.query(`
            DROP TABLE "wallet_auth_sessions"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_82f27d8cc4c2b2d2c7f1c977fa"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_bef196ffd7feeb31b48ffe644f"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_dd314e6fba34f5ffa1f2ff9f92"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_64f608d78b3d85a67287f77298"
        `);
    await queryRunner.query(`
            DROP TABLE "wallet_auth_keys"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."wallet_auth_keys_device_type_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."wallet_auth_keys_status_enum"
        `);
  }
}
