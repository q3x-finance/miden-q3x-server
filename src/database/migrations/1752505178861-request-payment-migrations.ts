import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationsts1752505178861 implements MigrationInterface {
  name = '1752505168954Migrations.ts1752505178861';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."request_payment_status_enum" AS ENUM('pending', 'accepted', 'denied')
        `);
    await queryRunner.query(`
            CREATE TABLE "request_payment" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "payer_address" character varying NOT NULL,
                "payee_address" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "token" character varying,
                "message" character varying NOT NULL,
                "status" "public"."request_payment_status_enum" NOT NULL DEFAULT 'pending',
                CONSTRAINT "PK_9cdfb2a54226ab609bb3770d9c7" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "request_payment"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."request_payment_status_enum"
        `);
  }
}
