import {MigrationInterface, QueryRunner} from "typeorm";

export class textEntity1560889933476 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "text_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "content" varchar NOT NULL, CONSTRAINT "UQ_114ffb586dc3da0a73116d6cf2e" UNIQUE ("name"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "text_entity"`);
    }

}
