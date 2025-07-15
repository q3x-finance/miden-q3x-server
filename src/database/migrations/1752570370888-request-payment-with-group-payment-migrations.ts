import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationsts1752570370888 implements MigrationInterface {
  name = '1752570360804Migrations.ts1752570370888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "is_group_payment" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "group_payment_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD "groupPaymentId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment"
            ADD CONSTRAINT "FK_e1233322d02cfe645f877ee0042" FOREIGN KEY ("groupPaymentId") REFERENCES "group_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP CONSTRAINT "FK_e1233322d02cfe645f877ee0042"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "groupPaymentId"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "group_payment_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "request_payment" DROP COLUMN "is_group_payment"
        `);
  }
}
