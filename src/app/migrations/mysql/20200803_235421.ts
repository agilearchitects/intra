import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line: class-name
export class _20200803_235421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `banned_token_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `token` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `activated` datetime NULL, `banned` datetime NULL, UNIQUE INDEX `IDX_415c35b9b3b6fe45a3b065030f` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_0bd21227754816190ee2ea0fb2` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `role_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_61db0b4faa9a193b713c7f952e` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `text_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `content` text NOT NULL, `claimId` int NOT NULL, `roleId` int NOT NULL, UNIQUE INDEX `IDX_114ffb586dc3da0a73116d6cf2` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `claim_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_82c3a48e8e295f1c16714046db` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_entity_claims_claim_entity` (`userEntityId` int NOT NULL, `claimEntityId` int NOT NULL, INDEX `IDX_eb9ac7890ca477e2cc6edbbb10` (`userEntityId`), INDEX `IDX_dead7734281173079d566baafa` (`claimEntityId`), PRIMARY KEY (`userEntityId`, `claimEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_entity_users_user_entity` (`groupEntityId` int NOT NULL, `userEntityId` int NOT NULL, INDEX `IDX_8facb9a9f0c78b9158f4a77b00` (`groupEntityId`), INDEX `IDX_c5ebd87a1a73c88ee35e336f75` (`userEntityId`), PRIMARY KEY (`groupEntityId`, `userEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_entity_claims_claim_entity` (`groupEntityId` int NOT NULL, `claimEntityId` int NOT NULL, INDEX `IDX_fd5b8a69362aff0674fd6a6d0b` (`groupEntityId`), INDEX `IDX_74371961e955d253894acf5cb0` (`claimEntityId`), PRIMARY KEY (`groupEntityId`, `claimEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `text_entity` ADD CONSTRAINT `FK_ab3fb6eade4eaf96af0cadc1a10` FOREIGN KEY (`claimId`) REFERENCES `claim_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `text_entity` ADD CONSTRAINT `FK_c2e2a48229bfe40bcac93903f6c` FOREIGN KEY (`roleId`) REFERENCES `role_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_entity_claims_claim_entity` ADD CONSTRAINT `FK_eb9ac7890ca477e2cc6edbbb10d` FOREIGN KEY (`userEntityId`) REFERENCES `user_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_entity_claims_claim_entity` ADD CONSTRAINT `FK_dead7734281173079d566baafac` FOREIGN KEY (`claimEntityId`) REFERENCES `claim_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_entity_users_user_entity` ADD CONSTRAINT `FK_8facb9a9f0c78b9158f4a77b00f` FOREIGN KEY (`groupEntityId`) REFERENCES `group_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_entity_users_user_entity` ADD CONSTRAINT `FK_c5ebd87a1a73c88ee35e336f758` FOREIGN KEY (`userEntityId`) REFERENCES `user_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_entity_claims_claim_entity` ADD CONSTRAINT `FK_fd5b8a69362aff0674fd6a6d0bf` FOREIGN KEY (`groupEntityId`) REFERENCES `group_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_entity_claims_claim_entity` ADD CONSTRAINT `FK_74371961e955d253894acf5cb0f` FOREIGN KEY (`claimEntityId`) REFERENCES `claim_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `group_entity_claims_claim_entity` DROP FOREIGN KEY `FK_74371961e955d253894acf5cb0f`");
        await queryRunner.query("ALTER TABLE `group_entity_claims_claim_entity` DROP FOREIGN KEY `FK_fd5b8a69362aff0674fd6a6d0bf`");
        await queryRunner.query("ALTER TABLE `group_entity_users_user_entity` DROP FOREIGN KEY `FK_c5ebd87a1a73c88ee35e336f758`");
        await queryRunner.query("ALTER TABLE `group_entity_users_user_entity` DROP FOREIGN KEY `FK_8facb9a9f0c78b9158f4a77b00f`");
        await queryRunner.query("ALTER TABLE `user_entity_claims_claim_entity` DROP FOREIGN KEY `FK_dead7734281173079d566baafac`");
        await queryRunner.query("ALTER TABLE `user_entity_claims_claim_entity` DROP FOREIGN KEY `FK_eb9ac7890ca477e2cc6edbbb10d`");
        await queryRunner.query("ALTER TABLE `text_entity` DROP FOREIGN KEY `FK_c2e2a48229bfe40bcac93903f6c`");
        await queryRunner.query("ALTER TABLE `text_entity` DROP FOREIGN KEY `FK_ab3fb6eade4eaf96af0cadc1a10`");
        await queryRunner.query("DROP INDEX `IDX_74371961e955d253894acf5cb0` ON `group_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_fd5b8a69362aff0674fd6a6d0b` ON `group_entity_claims_claim_entity`");
        await queryRunner.query("DROP TABLE `group_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_c5ebd87a1a73c88ee35e336f75` ON `group_entity_users_user_entity`");
        await queryRunner.query("DROP INDEX `IDX_8facb9a9f0c78b9158f4a77b00` ON `group_entity_users_user_entity`");
        await queryRunner.query("DROP TABLE `group_entity_users_user_entity`");
        await queryRunner.query("DROP INDEX `IDX_dead7734281173079d566baafa` ON `user_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_eb9ac7890ca477e2cc6edbbb10` ON `user_entity_claims_claim_entity`");
        await queryRunner.query("DROP TABLE `user_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_82c3a48e8e295f1c16714046db` ON `claim_entity`");
        await queryRunner.query("DROP TABLE `claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_114ffb586dc3da0a73116d6cf2` ON `text_entity`");
        await queryRunner.query("DROP TABLE `text_entity`");
        await queryRunner.query("DROP INDEX `IDX_61db0b4faa9a193b713c7f952e` ON `role_entity`");
        await queryRunner.query("DROP TABLE `role_entity`");
        await queryRunner.query("DROP INDEX `IDX_0bd21227754816190ee2ea0fb2` ON `group_entity`");
        await queryRunner.query("DROP TABLE `group_entity`");
        await queryRunner.query("DROP INDEX `IDX_415c35b9b3b6fe45a3b065030f` ON `user_entity`");
        await queryRunner.query("DROP TABLE `user_entity`");
        await queryRunner.query("DROP TABLE `banned_token_entity`");
    }

}
