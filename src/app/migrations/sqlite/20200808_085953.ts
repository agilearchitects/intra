import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line: class-name
export class _20200808_085953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "customer_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "rate" decimal, "priceBudget" decimal, "hoursBudget" decimal, "start" date, "end" date, "customerId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "tag_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "time_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "from" datetime NOT NULL, "to" datetime, "comment" varchar, "rate" decimal, "userId" integer NOT NULL, "taskId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "rate" decimal, "priceBudget" decimal, "hoursBudget" decimal, "projectId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task_user_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "rate" decimal, "taskId" integer NOT NULL, "userId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "time_entity_tags_tag_entity" ("timeEntityId" integer NOT NULL, "tagEntityId" integer NOT NULL, PRIMARY KEY ("timeEntityId", "tagEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_49123545365a2a4225f2228d78" ON "time_entity_tags_tag_entity" ("timeEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e67202babda3ef0afe097ffb4" ON "time_entity_tags_tag_entity" ("tagEntityId") `);
        await queryRunner.query(`CREATE TABLE "temporary_project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "rate" decimal, "priceBudget" decimal, "hoursBudget" decimal, "start" date, "end" date, "customerId" integer NOT NULL, CONSTRAINT "FK_6a519c02fd839683f7cb1328e73" FOREIGN KEY ("customerId") REFERENCES "customer_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_entity"("id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "start", "end", "customerId") SELECT "id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "start", "end", "customerId" FROM "project_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_entity" RENAME TO "project_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_time_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "from" datetime NOT NULL, "to" datetime, "comment" varchar, "rate" decimal, "userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "FK_39f46e32645cd96111b63b1d25b" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ba2d99b53d97f451a919ca31c36" FOREIGN KEY ("taskId") REFERENCES "task_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_time_entity"("id", "createdAt", "updatedAt", "from", "to", "comment", "rate", "userId", "taskId") SELECT "id", "createdAt", "updatedAt", "from", "to", "comment", "rate", "userId", "taskId" FROM "time_entity"`);
        await queryRunner.query(`DROP TABLE "time_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_time_entity" RENAME TO "time_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "rate" decimal, "priceBudget" decimal, "hoursBudget" decimal, "projectId" integer NOT NULL, CONSTRAINT "FK_059bf296d2b45a7c930faa15d7f" FOREIGN KEY ("projectId") REFERENCES "project_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task_entity"("id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "projectId") SELECT "id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "projectId" FROM "task_entity"`);
        await queryRunner.query(`DROP TABLE "task_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_entity" RENAME TO "task_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_user_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "rate" decimal, "taskId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "FK_f2fdb0351ecf4d6fec2a4216970" FOREIGN KEY ("taskId") REFERENCES "task_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_03cdb57fcc020dcd2cbcb13d7d9" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task_user_entity"("id", "createdAt", "updatedAt", "rate", "taskId", "userId") SELECT "id", "createdAt", "updatedAt", "rate", "taskId", "userId" FROM "task_user_entity"`);
        await queryRunner.query(`DROP TABLE "task_user_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_user_entity" RENAME TO "task_user_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_49123545365a2a4225f2228d78"`);
        await queryRunner.query(`DROP INDEX "IDX_2e67202babda3ef0afe097ffb4"`);
        await queryRunner.query(`CREATE TABLE "temporary_time_entity_tags_tag_entity" ("timeEntityId" integer NOT NULL, "tagEntityId" integer NOT NULL, CONSTRAINT "FK_49123545365a2a4225f2228d78c" FOREIGN KEY ("timeEntityId") REFERENCES "time_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_2e67202babda3ef0afe097ffb45" FOREIGN KEY ("tagEntityId") REFERENCES "tag_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("timeEntityId", "tagEntityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_time_entity_tags_tag_entity"("timeEntityId", "tagEntityId") SELECT "timeEntityId", "tagEntityId" FROM "time_entity_tags_tag_entity"`);
        await queryRunner.query(`DROP TABLE "time_entity_tags_tag_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_time_entity_tags_tag_entity" RENAME TO "time_entity_tags_tag_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_49123545365a2a4225f2228d78" ON "time_entity_tags_tag_entity" ("timeEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e67202babda3ef0afe097ffb4" ON "time_entity_tags_tag_entity" ("tagEntityId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_2e67202babda3ef0afe097ffb4"`);
        await queryRunner.query(`DROP INDEX "IDX_49123545365a2a4225f2228d78"`);
        await queryRunner.query(`ALTER TABLE "time_entity_tags_tag_entity" RENAME TO "temporary_time_entity_tags_tag_entity"`);
        await queryRunner.query(`CREATE TABLE "time_entity_tags_tag_entity" ("timeEntityId" integer NOT NULL, "tagEntityId" integer NOT NULL, PRIMARY KEY ("timeEntityId", "tagEntityId"))`);
        await queryRunner.query(`INSERT INTO "time_entity_tags_tag_entity"("timeEntityId", "tagEntityId") SELECT "timeEntityId", "tagEntityId" FROM "temporary_time_entity_tags_tag_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_time_entity_tags_tag_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_2e67202babda3ef0afe097ffb4" ON "time_entity_tags_tag_entity" ("tagEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_49123545365a2a4225f2228d78" ON "time_entity_tags_tag_entity" ("timeEntityId") `);
        await queryRunner.query(`ALTER TABLE "task_user_entity" RENAME TO "temporary_task_user_entity"`);
        await queryRunner.query(`CREATE TABLE "task_user_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "rate" decimal, "taskId" integer NOT NULL, "userId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "task_user_entity"("id", "createdAt", "updatedAt", "rate", "taskId", "userId") SELECT "id", "createdAt", "updatedAt", "rate", "taskId", "userId" FROM "temporary_task_user_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_task_user_entity"`);
        await queryRunner.query(`ALTER TABLE "task_entity" RENAME TO "temporary_task_entity"`);
        await queryRunner.query(`CREATE TABLE "task_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "rate" decimal, "priceBudget" decimal, "hoursBudget" decimal, "projectId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "task_entity"("id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "projectId") SELECT "id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "projectId" FROM "temporary_task_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_task_entity"`);
        await queryRunner.query(`ALTER TABLE "time_entity" RENAME TO "temporary_time_entity"`);
        await queryRunner.query(`CREATE TABLE "time_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "from" datetime NOT NULL, "to" datetime, "comment" varchar, "rate" decimal, "userId" integer NOT NULL, "taskId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "time_entity"("id", "createdAt", "updatedAt", "from", "to", "comment", "rate", "userId", "taskId") SELECT "id", "createdAt", "updatedAt", "from", "to", "comment", "rate", "userId", "taskId" FROM "temporary_time_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_time_entity"`);
        await queryRunner.query(`ALTER TABLE "project_entity" RENAME TO "temporary_project_entity"`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "rate" decimal, "priceBudget" decimal, "hoursBudget" decimal, "start" date, "end" date, "customerId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "project_entity"("id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "start", "end", "customerId") SELECT "id", "createdAt", "updatedAt", "name", "rate", "priceBudget", "hoursBudget", "start", "end", "customerId" FROM "temporary_project_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_2e67202babda3ef0afe097ffb4"`);
        await queryRunner.query(`DROP INDEX "IDX_49123545365a2a4225f2228d78"`);
        await queryRunner.query(`DROP TABLE "time_entity_tags_tag_entity"`);
        await queryRunner.query(`DROP TABLE "task_user_entity"`);
        await queryRunner.query(`DROP TABLE "task_entity"`);
        await queryRunner.query(`DROP TABLE "time_entity"`);
        await queryRunner.query(`DROP TABLE "tag_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "customer_entity"`);
    }

}
