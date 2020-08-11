import { MigrationInterface, QueryRunner } from "typeorm";

// tslint:disable-next-line: class-name
export class _20200811_114132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `customer_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `project_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `rate` decimal NULL, `priceBudget` decimal NULL, `hoursBudget` decimal NULL, `start` date NULL, `end` date NULL, `customerId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tag_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `time_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `from` datetime NOT NULL, `to` datetime NULL, `comment` varchar(255) NULL, `rate` decimal NULL, `userId` int NOT NULL, `taskId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `task_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `rate` decimal NULL, `priceBudget` decimal NULL, `hoursBudget` decimal NULL, `projectId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `task_user_entity` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `rate` decimal NULL, `taskId` int NOT NULL, `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `time_entity_tags_tag_entity` (`timeEntityId` int NOT NULL, `tagEntityId` int NOT NULL, INDEX `IDX_49123545365a2a4225f2228d78` (`timeEntityId`), INDEX `IDX_2e67202babda3ef0afe097ffb4` (`tagEntityId`), PRIMARY KEY (`timeEntityId`, `tagEntityId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `project_entity` ADD CONSTRAINT `FK_6a519c02fd839683f7cb1328e73` FOREIGN KEY (`customerId`) REFERENCES `customer_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity` ADD CONSTRAINT `FK_39f46e32645cd96111b63b1d25b` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity` ADD CONSTRAINT `FK_ba2d99b53d97f451a919ca31c36` FOREIGN KEY (`taskId`) REFERENCES `task_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `task_entity` ADD CONSTRAINT `FK_059bf296d2b45a7c930faa15d7f` FOREIGN KEY (`projectId`) REFERENCES `project_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `task_user_entity` ADD CONSTRAINT `FK_f2fdb0351ecf4d6fec2a4216970` FOREIGN KEY (`taskId`) REFERENCES `task_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `task_user_entity` ADD CONSTRAINT `FK_03cdb57fcc020dcd2cbcb13d7d9` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` ADD CONSTRAINT `FK_49123545365a2a4225f2228d78c` FOREIGN KEY (`timeEntityId`) REFERENCES `time_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` ADD CONSTRAINT `FK_2e67202babda3ef0afe097ffb45` FOREIGN KEY (`tagEntityId`) REFERENCES `tag_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` DROP FOREIGN KEY `FK_2e67202babda3ef0afe097ffb45`");
        await queryRunner.query("ALTER TABLE `time_entity_tags_tag_entity` DROP FOREIGN KEY `FK_49123545365a2a4225f2228d78c`");
        await queryRunner.query("ALTER TABLE `task_user_entity` DROP FOREIGN KEY `FK_03cdb57fcc020dcd2cbcb13d7d9`");
        await queryRunner.query("ALTER TABLE `task_user_entity` DROP FOREIGN KEY `FK_f2fdb0351ecf4d6fec2a4216970`");
        await queryRunner.query("ALTER TABLE `task_entity` DROP FOREIGN KEY `FK_059bf296d2b45a7c930faa15d7f`");
        await queryRunner.query("ALTER TABLE `time_entity` DROP FOREIGN KEY `FK_ba2d99b53d97f451a919ca31c36`");
        await queryRunner.query("ALTER TABLE `time_entity` DROP FOREIGN KEY `FK_39f46e32645cd96111b63b1d25b`");
        await queryRunner.query("ALTER TABLE `project_entity` DROP FOREIGN KEY `FK_6a519c02fd839683f7cb1328e73`");
        await queryRunner.query("DROP INDEX `IDX_2e67202babda3ef0afe097ffb4` ON `time_entity_tags_tag_entity`");
        await queryRunner.query("DROP INDEX `IDX_49123545365a2a4225f2228d78` ON `time_entity_tags_tag_entity`");
        await queryRunner.query("DROP TABLE `time_entity_tags_tag_entity`");
        await queryRunner.query("DROP TABLE `task_user_entity`");
        await queryRunner.query("DROP TABLE `task_entity`");
        await queryRunner.query("DROP TABLE `time_entity`");
        await queryRunner.query("DROP TABLE `tag_entity`");
        await queryRunner.query("DROP TABLE `project_entity`");
        await queryRunner.query("DROP TABLE `customer_entity`");
    }

}
