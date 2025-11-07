import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMovieLookups1762472886817 implements MigrationInterface {
    name = 'AddMovieLookups1762472886817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "age_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "label" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_b5a861efaefa505dd2602bb3050" UNIQUE ("code"), CONSTRAINT "PK_202b67bffc1702473d2c9851684" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "movieId" uuid, "genreId" uuid, CONSTRAINT "PK_ac57ed4f1d4d90418c135d6785a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."movies_status_enum" AS ENUM('RELEASED', 'UPCOMING', 'DRAFT')`);
        await queryRunner.query(`CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "title" character varying NOT NULL, "originalTitle" character varying, "synopsis" text, "coverUrl" character varying, "trailerUrl" character varying, "ageRatingId" uuid, "votes" integer NOT NULL DEFAULT '0', "duration" integer, "language" text array, "status" "public"."movies_status_enum" NOT NULL DEFAULT 'RELEASED', "budget" double precision, "revenue" double precision, "profit" double precision, "releaseDate" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "hashPassword" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movie_genres" ADD CONSTRAINT "FK_b26290545d3bb905a70af25acd0" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_genres" ADD CONSTRAINT "FK_d16b07e0cffb14d021d9b15b468" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "FK_64a78407424745d6c053e93cc36" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "FK_5b2a22606b8f0e1bcea9ea2fa4a" FOREIGN KEY ("ageRatingId") REFERENCES "age_ratings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "FK_5b2a22606b8f0e1bcea9ea2fa4a"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "FK_64a78407424745d6c053e93cc36"`);
        await queryRunner.query(`ALTER TABLE "movie_genres" DROP CONSTRAINT "FK_d16b07e0cffb14d021d9b15b468"`);
        await queryRunner.query(`ALTER TABLE "movie_genres" DROP CONSTRAINT "FK_b26290545d3bb905a70af25acd0"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TYPE "public"."movies_status_enum"`);
        await queryRunner.query(`DROP TABLE "movie_genres"`);
        await queryRunner.query(`DROP TABLE "genres"`);
        await queryRunner.query(`DROP TABLE "age_ratings"`);
    }

}
