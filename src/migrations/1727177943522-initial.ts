import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1727177943522 implements MigrationInterface {
    name = 'Initial1727177943522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`books\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`isbn\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`authorId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`authors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6c64b3df09e6774438aeca7e0b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_54f49efe2dd4d2850e736e9ab86\` FOREIGN KEY (\`authorId\`) REFERENCES \`authors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_54f49efe2dd4d2850e736e9ab86\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c64b3df09e6774438aeca7e0b\` ON \`authors\``);
        await queryRunner.query(`DROP TABLE \`authors\``);
        await queryRunner.query(`DROP TABLE \`books\``);
    }

}
