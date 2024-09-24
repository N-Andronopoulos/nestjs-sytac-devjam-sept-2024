import { MigrationInterface, QueryRunner } from "typeorm";

export class DataColumns1727178194146 implements MigrationInterface {
    name = 'DataColumns1727178194146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`authors\` ADD \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`authors\` ADD \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`updated\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`created\``);
        await queryRunner.query(`ALTER TABLE \`authors\` DROP COLUMN \`updated\``);
        await queryRunner.query(`ALTER TABLE \`authors\` DROP COLUMN \`created\``);
    }

}
