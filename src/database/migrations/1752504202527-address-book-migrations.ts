import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationsts1752504202527 implements MigrationInterface {
  name = '1752504135516Migrations.ts1752504202527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "address_book" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "user_address" character varying NOT NULL,
                "category" character varying NOT NULL,
                "name" character varying NOT NULL,
                "address" character varying NOT NULL,
                "token" character varying,
                CONSTRAINT "PK_188a02dee277dd0f9e488fdf06f" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "address_book"
        `);
  }
}
