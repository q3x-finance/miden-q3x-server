import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionMigrationsts1752488386249
  implements MigrationInterface
{
  name = '1752488350315TransactionMigrations.ts1752488386249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."transactions_note_type_enum" AS ENUM('p2id', 'p2idr')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'recalled', 'consumed')
        `);
    await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "sender" character varying NOT NULL,
                "recipient" character varying NOT NULL,
                "assets" jsonb NOT NULL,
                "private" boolean NOT NULL DEFAULT false,
                "recallable" boolean NOT NULL DEFAULT false,
                "recallable_time" TIMESTAMP,
                "serial_number" jsonb NOT NULL,
                "note_type" "public"."transactions_note_type_enum",
                "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending',
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_a78a00605c95ca6737389f6360b"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_a78a00605c95ca6737389f6360b" UNIQUE ("referred_by_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_a78a00605c95ca6737389f6360b" FOREIGN KEY ("referred_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_a78a00605c95ca6737389f6360b"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_a78a00605c95ca6737389f6360b"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_a78a00605c95ca6737389f6360b" FOREIGN KEY ("referred_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            DROP TABLE "transactions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transactions_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transactions_note_type_enum"
        `);
  }
}
