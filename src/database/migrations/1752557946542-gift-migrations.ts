import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationsts1752557946542 implements MigrationInterface {
  name = '1752557938564Migrations.ts1752557946542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."gift_note_type_enum" AS ENUM('p2id', 'p2idr', 'gift')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_status_enum" AS ENUM('pending', 'recalled', 'consumed')
        `);
    await queryRunner.query(`
            CREATE TABLE "gift" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "sender" character varying NOT NULL,
                "assets" jsonb NOT NULL,
                "private" boolean NOT NULL DEFAULT true,
                "recallable" boolean NOT NULL DEFAULT true,
                "recallable_time" TIMESTAMP,
                "serial_number" jsonb NOT NULL,
                "note_type" "public"."gift_note_type_enum" NOT NULL DEFAULT 'gift',
                "status" "public"."gift_status_enum" NOT NULL DEFAULT 'pending',
                "secret_hash" character varying NOT NULL,
                "recalled_at" TIMESTAMP,
                "opened_at" TIMESTAMP,
                CONSTRAINT "UQ_86900efd866b220cc5768ad7a97" UNIQUE ("secret_hash"),
                CONSTRAINT "PK_f91217caddc01a085837ebe0606" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "payer_address"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "payee_address"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "payer" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "payee" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ALTER COLUMN "private"
            SET DEFAULT true
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ALTER COLUMN "recallable"
            SET DEFAULT true
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ALTER COLUMN "recallable"
            SET DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ALTER COLUMN "private"
            SET DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "payee"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "payer"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "payee_address" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "payer_address" character varying NOT NULL
        `);
    await queryRunner.query(`
            DROP TABLE "gift"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_note_type_enum"
        `);
  }
}
