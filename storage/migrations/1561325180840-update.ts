import { MigrationInterface, QueryRunner } from "typeorm";

export class update1561325180840 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "time_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "from" datetime NOT NULL, "to" datetime, "comment" varchar, "projectId" integer, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "customerId" integer)`);
        await queryRunner.query(`CREATE TABLE "customer_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "time_customer_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "customerId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_project_entity"("id", "createdAt", "updatedAt", "customerId") SELECT "id", "createdAt", "updatedAt", "customerId" FROM "project_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_entity" RENAME TO "project_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "customerId" integer, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_project_entity"("id", "createdAt", "updatedAt", "customerId") SELECT "id", "createdAt", "updatedAt", "customerId" FROM "project_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_entity" RENAME TO "project_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_time_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "from" datetime NOT NULL, "to" datetime, "comment" varchar, "projectId" integer, "userId" integer, CONSTRAINT "FK_39f46e32645cd96111b63b1d25b" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_255bdfd3064b0e4622fd4f12c9d" FOREIGN KEY ("projectId") REFERENCES "project_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_time_entity"("id", "createdAt", "updatedAt", "from", "to", "comment", "projectId", "userId") SELECT "id", "createdAt", "updatedAt", "from", "to", "comment", "projectId", "userId" FROM "time_entity"`);
        await queryRunner.query(`DROP TABLE "time_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_time_entity" RENAME TO "time_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "customerId" integer, "name" varchar NOT NULL, CONSTRAINT "FK_6a519c02fd839683f7cb1328e73" FOREIGN KEY ("customerId") REFERENCES "customer_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_entity"("id", "createdAt", "updatedAt", "customerId", "name") SELECT "id", "createdAt", "updatedAt", "customerId", "name" FROM "project_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_entity" RENAME TO "project_entity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_entity" RENAME TO "temporary_project_entity"`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "customerId" integer, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "project_entity"("id", "createdAt", "updatedAt", "customerId", "name") SELECT "id", "createdAt", "updatedAt", "customerId", "name" FROM "temporary_project_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_entity"`);
        await queryRunner.query(`ALTER TABLE "time_entity" RENAME TO "temporary_time_entity"`);
        await queryRunner.query(`CREATE TABLE "time_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "from" datetime NOT NULL, "to" datetime, "comment" varchar, "projectId" integer, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "time_entity"("id", "createdAt", "updatedAt", "from", "to", "comment", "projectId", "userId") SELECT "id", "createdAt", "updatedAt", "from", "to", "comment", "projectId", "userId" FROM "temporary_time_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_time_entity"`);
        await queryRunner.query(`ALTER TABLE "project_entity" RENAME TO "temporary_project_entity"`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "customerId" integer)`);
        await queryRunner.query(`INSERT INTO "project_entity"("id", "createdAt", "updatedAt", "customerId") SELECT "id", "createdAt", "updatedAt", "customerId" FROM "temporary_project_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_entity"`);
        await queryRunner.query(`ALTER TABLE "project_entity" RENAME TO "temporary_project_entity"`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "customerId" integer)`);
        await queryRunner.query(`INSERT INTO "project_entity"("id", "createdAt", "updatedAt", "customerId") SELECT "id", "createdAt", "updatedAt", "customerId" FROM "temporary_project_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_entity"`);
        await queryRunner.query(`DROP TABLE "time_customer_entity"`);
        await queryRunner.query(`DROP TABLE "customer_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "time_entity"`);
    }

}
