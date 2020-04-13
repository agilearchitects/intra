import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line: class-name
export class _20200413_200506 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `banned_token_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `token` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `customer_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `project_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `rate` decimal NULL, `priceBudget` decimal NULL, `hoursBudget` decimal NULL, `start` date NULL, `end` date NULL, `customerId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tag_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `time_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `from` datetime NOT NULL, `to` datetime NULL, `comment` varchar(255) NULL, `rate` decimal NULL, `userId` int NOT NULL, `taskId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `task_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `rate` decimal NULL, `priceBudget` decimal NULL, `hoursBudget` decimal NULL, `projectId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `task_user_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `rate` decimal NULL, `taskId` int NOT NULL, `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `activated` datetime NULL, `banned` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `claim_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_82c3a48e8e295f1c16714046db` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `resource_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `filename` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, UNIQUE INDEX `IDX_e86af3c5bcb588f570dba0b854` (`filename`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `text_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, UNIQUE INDEX `IDX_114ffb586dc3da0a73116d6cf2` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `token_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `token` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `expires` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `time_entity_tags_tag_entity` (`timeEntityId` int NOT NULL, `tagEntityId` int NOT NULL, INDEX `IDX_49123545365a2a4225f2228d78` (`timeEntityId`), INDEX `IDX_2e67202babda3ef0afe097ffb4` (`tagEntityId`), PRIMARY KEY (`timeEntityId`, `tagEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_entity_claims_claim_entity` (`userEntityId` int NOT NULL, `claimEntityId` int NOT NULL, INDEX `IDX_eb9ac7890ca477e2cc6edbbb10` (`userEntityId`), INDEX `IDX_dead7734281173079d566baafa` (`claimEntityId`), PRIMARY KEY (`userEntityId`, `claimEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_entity_users_user_entity` (`groupEntityId` int NOT NULL, `userEntityId` int NOT NULL, INDEX `IDX_8facb9a9f0c78b9158f4a77b00` (`groupEntityId`), INDEX `IDX_c5ebd87a1a73c88ee35e336f75` (`userEntityId`), PRIMARY KEY (`groupEntityId`, `userEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_entity_claims_claim_entity` (`groupEntityId` int NOT NULL, `claimEntityId` int NOT NULL, INDEX `IDX_fd5b8a69362aff0674fd6a6d0b` (`groupEntityId`), INDEX `IDX_74371961e955d253894acf5cb0` (`claimEntityId`), PRIMARY KEY (`groupEntityId`, `claimEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `project_entity` ADD CONSTRAINT `FK_6a519c02fd839683f7cb1328e73` FOREIGN KEY (`customerId`) REFERENCES `customer_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity` ADD CONSTRAINT `FK_39f46e32645cd96111b63b1d25b` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity` ADD CONSTRAINT `FK_ba2d99b53d97f451a919ca31c36` FOREIGN KEY (`taskId`) REFERENCES `task_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `task_entity` ADD CONSTRAINT `FK_059bf296d2b45a7c930faa15d7f` FOREIGN KEY (`projectId`) REFERENCES `project_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `task_user_entity` ADD CONSTRAINT `FK_f2fdb0351ecf4d6fec2a4216970` FOREIGN KEY (`taskId`) REFERENCES `task_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `task_user_entity` ADD CONSTRAINT `FK_03cdb57fcc020dcd2cbcb13d7d9` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` ADD CONSTRAINT `FK_49123545365a2a4225f2228d78c` FOREIGN KEY (`timeEntityId`) REFERENCES `time_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` ADD CONSTRAINT `FK_2e67202babda3ef0afe097ffb45` FOREIGN KEY (`tagEntityId`) REFERENCES `tag_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
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
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` DROP FOREIGN KEY `FK_2e67202babda3ef0afe097ffb45`");
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` DROP FOREIGN KEY `FK_49123545365a2a4225f2228d78c`");
        await queryRunner.query("ALTER TABLE `task_user_entity` DROP FOREIGN KEY `FK_03cdb57fcc020dcd2cbcb13d7d9`");
        await queryRunner.query("ALTER TABLE `task_user_entity` DROP FOREIGN KEY `FK_f2fdb0351ecf4d6fec2a4216970`");
        await queryRunner.query("ALTER TABLE `task_entity` DROP FOREIGN KEY `FK_059bf296d2b45a7c930faa15d7f`");
        await queryRunner.query("ALTER TABLE `time_entity` DROP FOREIGN KEY `FK_ba2d99b53d97f451a919ca31c36`");
        await queryRunner.query("ALTER TABLE `time_entity` DROP FOREIGN KEY `FK_39f46e32645cd96111b63b1d25b`");
        await queryRunner.query("ALTER TABLE `project_entity` DROP FOREIGN KEY `FK_6a519c02fd839683f7cb1328e73`");
        await queryRunner.query("DROP INDEX `IDX_74371961e955d253894acf5cb0` ON `group_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_fd5b8a69362aff0674fd6a6d0b` ON `group_entity_claims_claim_entity`");
        await queryRunner.query("DROP TABLE `group_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_c5ebd87a1a73c88ee35e336f75` ON `group_entity_users_user_entity`");
        await queryRunner.query("DROP INDEX `IDX_8facb9a9f0c78b9158f4a77b00` ON `group_entity_users_user_entity`");
        await queryRunner.query("DROP TABLE `group_entity_users_user_entity`");
        await queryRunner.query("DROP INDEX `IDX_dead7734281173079d566baafa` ON `user_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_eb9ac7890ca477e2cc6edbbb10` ON `user_entity_claims_claim_entity`");
        await queryRunner.query("DROP TABLE `user_entity_claims_claim_entity`");
        await queryRunner.query("DROP INDEX `IDX_2e67202babda3ef0afe097ffb4` ON `time_entity_tags_tag_entity`");
        await queryRunner.query("DROP INDEX `IDX_49123545365a2a4225f2228d78` ON `time_entity_tags_tag_entity`");
        await queryRunner.query("DROP TABLE `time_entity_tags_tag_entity`");
        await queryRunner.query("DROP TABLE `token_entity`");
        await queryRunner.query("DROP INDEX `IDX_114ffb586dc3da0a73116d6cf2` ON `text_entity`");
        await queryRunner.query("DROP TABLE `text_entity`");
        await queryRunner.query("DROP INDEX `IDX_e86af3c5bcb588f570dba0b854` ON `resource_entity`");
        await queryRunner.query("DROP TABLE `resource_entity`");
        await queryRunner.query("DROP INDEX `IDX_82c3a48e8e295f1c16714046db` ON `claim_entity`");
        await queryRunner.query("DROP TABLE `claim_entity`");
        await queryRunner.query("DROP TABLE `group_entity`");
        await queryRunner.query("DROP TABLE `user_entity`");
        await queryRunner.query("DROP TABLE `task_user_entity`");
        await queryRunner.query("DROP TABLE `task_entity`");
        await queryRunner.query("DROP TABLE `time_entity`");
        await queryRunner.query("DROP TABLE `tag_entity`");
        await queryRunner.query("DROP TABLE `project_entity`");
        await queryRunner.query("DROP TABLE `customer_entity`");
        await queryRunner.query("DROP TABLE `banned_token_entity`");
    }

}
