import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationsts1752572497798 implements MigrationInterface {
  name = '1752572482557Migrations.ts1752572497798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."analytics_events_event_type_enum" AS ENUM(
                'page_view',
                'endpoint_call',
                'user_session',
                'transaction',
                'gift',
                'group_payment',
                'request_payment'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "analytics_events" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "event_type" "public"."analytics_events_event_type_enum" NOT NULL,
                "user_address" character varying,
                "session_id" character varying,
                "metadata" jsonb,
                "ip_address" character varying,
                "user_agent" character varying,
                "referer" character varying,
                CONSTRAINT "PK_5d643d67a09b55653e98616f421" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_06a6a7ed42c37bd636c8b80524" ON "analytics_events" ("user_address")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_595cb60b85eacaa61f4c84b00d" ON "analytics_events" ("created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_b3218ffc81c99b2e6fa3e9616e" ON "analytics_events" ("user_address", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ca5cf2fce11e3f43c09b2d0077" ON "analytics_events" ("event_type", "created_at")
        `);
    await queryRunner.query(`
            CREATE TABLE "analytics_user_sessions" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "session_id" character varying NOT NULL,
                "user_address" character varying,
                "start_time" TIMESTAMP NOT NULL,
                "end_time" TIMESTAMP,
                "duration" integer NOT NULL DEFAULT '0',
                "page_views" integer NOT NULL DEFAULT '0',
                "api_calls" integer NOT NULL DEFAULT '0',
                "ip_address" character varying,
                "user_agent" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_bb90cdc04107d1c92d93fffe502" UNIQUE ("session_id"),
                CONSTRAINT "PK_afca360a12c2e39873b6a373450" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_bb90cdc04107d1c92d93fffe50" ON "analytics_user_sessions" ("session_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_322256cfa53887a1facafb787f" ON "analytics_user_sessions" ("user_address", "created_at")
        `);
    await queryRunner.query(`
            CREATE TABLE "analytics_endpoint_stats" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "endpoint" character varying NOT NULL,
                "method" character varying NOT NULL,
                "response_time" integer NOT NULL,
                "status_code" integer NOT NULL,
                "user_address" character varying,
                "session_id" character varying,
                "ip_address" character varying,
                "error_details" jsonb,
                CONSTRAINT "PK_ba98749eddce2fdd5f3441cb1c8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_74ddc7ba61c26e64094e43aa58" ON "analytics_endpoint_stats" ("method", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_9bbd10a409da8b095a7b58b899" ON "analytics_endpoint_stats" ("endpoint", "created_at")
        `);
    await queryRunner.query(`
            CREATE TABLE "analytics_transaction_stats" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "transaction_type" character varying NOT NULL,
                "token" character varying NOT NULL,
                "amount" numeric(20, 6) NOT NULL,
                "sender_address" character varying NOT NULL,
                "receiver_address" character varying,
                "status" character varying,
                "entity_id" integer,
                "additional_data" jsonb,
                CONSTRAINT "PK_b578a1a8c8cbebbe2f34b837cbe" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_3e18284d03cf60c26c3119de07" ON "analytics_transaction_stats" ("transaction_type", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_bed9bb07ee0ec81ab17ae9a9eb" ON "analytics_transaction_stats" ("token", "created_at")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_bed9bb07ee0ec81ab17ae9a9eb"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_3e18284d03cf60c26c3119de07"
        `);
    await queryRunner.query(`
            DROP TABLE "analytics_transaction_stats"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9bbd10a409da8b095a7b58b899"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_74ddc7ba61c26e64094e43aa58"
        `);
    await queryRunner.query(`
            DROP TABLE "analytics_endpoint_stats"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_322256cfa53887a1facafb787f"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_bb90cdc04107d1c92d93fffe50"
        `);
    await queryRunner.query(`
            DROP TABLE "analytics_user_sessions"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ca5cf2fce11e3f43c09b2d0077"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_b3218ffc81c99b2e6fa3e9616e"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_595cb60b85eacaa61f4c84b00d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_06a6a7ed42c37bd636c8b80524"
        `);
    await queryRunner.query(`
            DROP TABLE "analytics_events"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."analytics_events_event_type_enum"
        `);
  }
}
