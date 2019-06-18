import { MigrationInterface, QueryRunner } from "typeorm";

export class init1560843043796 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "password" varchar(40) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "group_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "resource_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "filename" varchar NOT NULL, "title" varchar NOT NULL, CONSTRAINT "UQ_e86af3c5bcb588f570dba0b854f" UNIQUE ("filename"))`);
        await queryRunner.query(`CREATE TABLE "group_entity_users_user_entity" ("groupEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, PRIMARY KEY ("groupEntityId", "userEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8facb9a9f0c78b9158f4a77b00" ON "group_entity_users_user_entity" ("groupEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5ebd87a1a73c88ee35e336f75" ON "group_entity_users_user_entity" ("userEntityId") `);
        await queryRunner.query(`DROP INDEX "IDX_8facb9a9f0c78b9158f4a77b00"`);
        await queryRunner.query(`DROP INDEX "IDX_c5ebd87a1a73c88ee35e336f75"`);
        await queryRunner.query(`CREATE TABLE "temporary_group_entity_users_user_entity" ("groupEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, CONSTRAINT "FK_8facb9a9f0c78b9158f4a77b00f" FOREIGN KEY ("groupEntityId") REFERENCES "group_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c5ebd87a1a73c88ee35e336f758" FOREIGN KEY ("userEntityId") REFERENCES "user_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("groupEntityId", "userEntityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_group_entity_users_user_entity"("groupEntityId", "userEntityId") SELECT "groupEntityId", "userEntityId" FROM "group_entity_users_user_entity"`);
        await queryRunner.query(`DROP TABLE "group_entity_users_user_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_group_entity_users_user_entity" RENAME TO "group_entity_users_user_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_8facb9a9f0c78b9158f4a77b00" ON "group_entity_users_user_entity" ("groupEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5ebd87a1a73c88ee35e336f75" ON "group_entity_users_user_entity" ("userEntityId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_c5ebd87a1a73c88ee35e336f75"`);
        await queryRunner.query(`DROP INDEX "IDX_8facb9a9f0c78b9158f4a77b00"`);
        await queryRunner.query(`ALTER TABLE "group_entity_users_user_entity" RENAME TO "temporary_group_entity_users_user_entity"`);
        await queryRunner.query(`CREATE TABLE "group_entity_users_user_entity" ("groupEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, PRIMARY KEY ("groupEntityId", "userEntityId"))`);
        await queryRunner.query(`INSERT INTO "group_entity_users_user_entity"("groupEntityId", "userEntityId") SELECT "groupEntityId", "userEntityId" FROM "temporary_group_entity_users_user_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_group_entity_users_user_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_c5ebd87a1a73c88ee35e336f75" ON "group_entity_users_user_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8facb9a9f0c78b9158f4a77b00" ON "group_entity_users_user_entity" ("groupEntityId") `);
        await queryRunner.query(`DROP INDEX "IDX_c5ebd87a1a73c88ee35e336f75"`);
        await queryRunner.query(`DROP INDEX "IDX_8facb9a9f0c78b9158f4a77b00"`);
        await queryRunner.query(`DROP TABLE "group_entity_users_user_entity"`);
        await queryRunner.query(`DROP TABLE "resource_entity"`);
        await queryRunner.query(`DROP TABLE "group_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
