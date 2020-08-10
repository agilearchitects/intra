import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line: class-name
export class _20200625_094039 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "banned_token_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "token" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "password" varchar NOT NULL, "activated" datetime, "banned" datetime, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "group_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, CONSTRAINT "UQ_0bd21227754816190ee2ea0fb20" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "role_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, CONSTRAINT "UQ_61db0b4faa9a193b713c7f952e1" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "text_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "content" text NOT NULL, "claimId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "UQ_114ffb586dc3da0a73116d6cf2e" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "claim_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, CONSTRAINT "UQ_82c3a48e8e295f1c16714046dba" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "user_entity_claims_claim_entity" ("userEntityId" integer NOT NULL, "claimEntityId" integer NOT NULL, PRIMARY KEY ("userEntityId", "claimEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb9ac7890ca477e2cc6edbbb10" ON "user_entity_claims_claim_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dead7734281173079d566baafa" ON "user_entity_claims_claim_entity" ("claimEntityId") `);
        await queryRunner.query(`CREATE TABLE "group_entity_users_user_entity" ("groupEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, PRIMARY KEY ("groupEntityId", "userEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8facb9a9f0c78b9158f4a77b00" ON "group_entity_users_user_entity" ("groupEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5ebd87a1a73c88ee35e336f75" ON "group_entity_users_user_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE TABLE "group_entity_claims_claim_entity" ("groupEntityId" integer NOT NULL, "claimEntityId" integer NOT NULL, PRIMARY KEY ("groupEntityId", "claimEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd5b8a69362aff0674fd6a6d0b" ON "group_entity_claims_claim_entity" ("groupEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_74371961e955d253894acf5cb0" ON "group_entity_claims_claim_entity" ("claimEntityId") `);
        await queryRunner.query(`CREATE TABLE "temporary_text_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "content" text NOT NULL, "claimId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "UQ_114ffb586dc3da0a73116d6cf2e" UNIQUE ("name"), CONSTRAINT "FK_ab3fb6eade4eaf96af0cadc1a10" FOREIGN KEY ("claimId") REFERENCES "claim_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c2e2a48229bfe40bcac93903f6c" FOREIGN KEY ("roleId") REFERENCES "role_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_text_entity"("id", "createdAt", "updatedAt", "name", "content", "claimId", "roleId") SELECT "id", "createdAt", "updatedAt", "name", "content", "claimId", "roleId" FROM "text_entity"`);
        await queryRunner.query(`DROP TABLE "text_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_text_entity" RENAME TO "text_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_eb9ac7890ca477e2cc6edbbb10"`);
        await queryRunner.query(`DROP INDEX "IDX_dead7734281173079d566baafa"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_entity_claims_claim_entity" ("userEntityId" integer NOT NULL, "claimEntityId" integer NOT NULL, CONSTRAINT "FK_eb9ac7890ca477e2cc6edbbb10d" FOREIGN KEY ("userEntityId") REFERENCES "user_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_dead7734281173079d566baafac" FOREIGN KEY ("claimEntityId") REFERENCES "claim_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userEntityId", "claimEntityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_entity_claims_claim_entity"("userEntityId", "claimEntityId") SELECT "userEntityId", "claimEntityId" FROM "user_entity_claims_claim_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity_claims_claim_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_entity_claims_claim_entity" RENAME TO "user_entity_claims_claim_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_eb9ac7890ca477e2cc6edbbb10" ON "user_entity_claims_claim_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dead7734281173079d566baafa" ON "user_entity_claims_claim_entity" ("claimEntityId") `);
        await queryRunner.query(`DROP INDEX "IDX_8facb9a9f0c78b9158f4a77b00"`);
        await queryRunner.query(`DROP INDEX "IDX_c5ebd87a1a73c88ee35e336f75"`);
        await queryRunner.query(`CREATE TABLE "temporary_group_entity_users_user_entity" ("groupEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, CONSTRAINT "FK_8facb9a9f0c78b9158f4a77b00f" FOREIGN KEY ("groupEntityId") REFERENCES "group_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c5ebd87a1a73c88ee35e336f758" FOREIGN KEY ("userEntityId") REFERENCES "user_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("groupEntityId", "userEntityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_group_entity_users_user_entity"("groupEntityId", "userEntityId") SELECT "groupEntityId", "userEntityId" FROM "group_entity_users_user_entity"`);
        await queryRunner.query(`DROP TABLE "group_entity_users_user_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_group_entity_users_user_entity" RENAME TO "group_entity_users_user_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_8facb9a9f0c78b9158f4a77b00" ON "group_entity_users_user_entity" ("groupEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5ebd87a1a73c88ee35e336f75" ON "group_entity_users_user_entity" ("userEntityId") `);
        await queryRunner.query(`DROP INDEX "IDX_fd5b8a69362aff0674fd6a6d0b"`);
        await queryRunner.query(`DROP INDEX "IDX_74371961e955d253894acf5cb0"`);
        await queryRunner.query(`CREATE TABLE "temporary_group_entity_claims_claim_entity" ("groupEntityId" integer NOT NULL, "claimEntityId" integer NOT NULL, CONSTRAINT "FK_fd5b8a69362aff0674fd6a6d0bf" FOREIGN KEY ("groupEntityId") REFERENCES "group_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_74371961e955d253894acf5cb0f" FOREIGN KEY ("claimEntityId") REFERENCES "claim_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("groupEntityId", "claimEntityId"))`);
        await queryRunner.query(`INSERT INTO "temporary_group_entity_claims_claim_entity"("groupEntityId", "claimEntityId") SELECT "groupEntityId", "claimEntityId" FROM "group_entity_claims_claim_entity"`);
        await queryRunner.query(`DROP TABLE "group_entity_claims_claim_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_group_entity_claims_claim_entity" RENAME TO "group_entity_claims_claim_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_fd5b8a69362aff0674fd6a6d0b" ON "group_entity_claims_claim_entity" ("groupEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_74371961e955d253894acf5cb0" ON "group_entity_claims_claim_entity" ("claimEntityId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_74371961e955d253894acf5cb0"`);
        await queryRunner.query(`DROP INDEX "IDX_fd5b8a69362aff0674fd6a6d0b"`);
        await queryRunner.query(`ALTER TABLE "group_entity_claims_claim_entity" RENAME TO "temporary_group_entity_claims_claim_entity"`);
        await queryRunner.query(`CREATE TABLE "group_entity_claims_claim_entity" ("groupEntityId" integer NOT NULL, "claimEntityId" integer NOT NULL, PRIMARY KEY ("groupEntityId", "claimEntityId"))`);
        await queryRunner.query(`INSERT INTO "group_entity_claims_claim_entity"("groupEntityId", "claimEntityId") SELECT "groupEntityId", "claimEntityId" FROM "temporary_group_entity_claims_claim_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_group_entity_claims_claim_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_74371961e955d253894acf5cb0" ON "group_entity_claims_claim_entity" ("claimEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd5b8a69362aff0674fd6a6d0b" ON "group_entity_claims_claim_entity" ("groupEntityId") `);
        await queryRunner.query(`DROP INDEX "IDX_c5ebd87a1a73c88ee35e336f75"`);
        await queryRunner.query(`DROP INDEX "IDX_8facb9a9f0c78b9158f4a77b00"`);
        await queryRunner.query(`ALTER TABLE "group_entity_users_user_entity" RENAME TO "temporary_group_entity_users_user_entity"`);
        await queryRunner.query(`CREATE TABLE "group_entity_users_user_entity" ("groupEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, PRIMARY KEY ("groupEntityId", "userEntityId"))`);
        await queryRunner.query(`INSERT INTO "group_entity_users_user_entity"("groupEntityId", "userEntityId") SELECT "groupEntityId", "userEntityId" FROM "temporary_group_entity_users_user_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_group_entity_users_user_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_c5ebd87a1a73c88ee35e336f75" ON "group_entity_users_user_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8facb9a9f0c78b9158f4a77b00" ON "group_entity_users_user_entity" ("groupEntityId") `);
        await queryRunner.query(`DROP INDEX "IDX_dead7734281173079d566baafa"`);
        await queryRunner.query(`DROP INDEX "IDX_eb9ac7890ca477e2cc6edbbb10"`);
        await queryRunner.query(`ALTER TABLE "user_entity_claims_claim_entity" RENAME TO "temporary_user_entity_claims_claim_entity"`);
        await queryRunner.query(`CREATE TABLE "user_entity_claims_claim_entity" ("userEntityId" integer NOT NULL, "claimEntityId" integer NOT NULL, PRIMARY KEY ("userEntityId", "claimEntityId"))`);
        await queryRunner.query(`INSERT INTO "user_entity_claims_claim_entity"("userEntityId", "claimEntityId") SELECT "userEntityId", "claimEntityId" FROM "temporary_user_entity_claims_claim_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_user_entity_claims_claim_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_dead7734281173079d566baafa" ON "user_entity_claims_claim_entity" ("claimEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb9ac7890ca477e2cc6edbbb10" ON "user_entity_claims_claim_entity" ("userEntityId") `);
        await queryRunner.query(`ALTER TABLE "text_entity" RENAME TO "temporary_text_entity"`);
        await queryRunner.query(`CREATE TABLE "text_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "content" text NOT NULL, "claimId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "UQ_114ffb586dc3da0a73116d6cf2e" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "text_entity"("id", "createdAt", "updatedAt", "name", "content", "claimId", "roleId") SELECT "id", "createdAt", "updatedAt", "name", "content", "claimId", "roleId" FROM "temporary_text_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_text_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_74371961e955d253894acf5cb0"`);
        await queryRunner.query(`DROP INDEX "IDX_fd5b8a69362aff0674fd6a6d0b"`);
        await queryRunner.query(`DROP TABLE "group_entity_claims_claim_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_c5ebd87a1a73c88ee35e336f75"`);
        await queryRunner.query(`DROP INDEX "IDX_8facb9a9f0c78b9158f4a77b00"`);
        await queryRunner.query(`DROP TABLE "group_entity_users_user_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_dead7734281173079d566baafa"`);
        await queryRunner.query(`DROP INDEX "IDX_eb9ac7890ca477e2cc6edbbb10"`);
        await queryRunner.query(`DROP TABLE "user_entity_claims_claim_entity"`);
        await queryRunner.query(`DROP TABLE "claim_entity"`);
        await queryRunner.query(`DROP TABLE "text_entity"`);
        await queryRunner.query(`DROP TABLE "role_entity"`);
        await queryRunner.query(`DROP TABLE "group_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "banned_token_entity"`);
    }

}
