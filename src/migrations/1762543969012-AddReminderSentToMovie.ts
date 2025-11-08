import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReminderSentToMovie1762543969012 implements MigrationInterface {
    name = 'AddReminderSentToMovie1762543969012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie_reminders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "movie_id" uuid NOT NULL, "remindAt" date NOT NULL, "sent" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2a55b6567225345a2ee775e5436" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movie_reminders" ADD CONSTRAINT "FK_84d87e258ad00df434d22e592f2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_reminders" ADD CONSTRAINT "FK_17f0638295ed8fe35b8c5239739" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_reminders" DROP CONSTRAINT "FK_17f0638295ed8fe35b8c5239739"`);
        await queryRunner.query(`ALTER TABLE "movie_reminders" DROP CONSTRAINT "FK_84d87e258ad00df434d22e592f2"`);
        await queryRunner.query(`DROP TABLE "movie_reminders"`);
    }

}
