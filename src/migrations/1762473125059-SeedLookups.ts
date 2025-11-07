import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedLookups1730920000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO age_ratings (id, code, label, description)
      VALUES
        ('11111111-1111-1111-1111-111111111111', 'L',  'Livre', 'Livre para todos os públicos'),
        ('22222222-2222-2222-2222-222222222222', '10', '10 anos', 'Não recomendado para menores de 10 anos'),
        ('33333333-3333-3333-3333-333333333333', '12', '12 anos', 'Não recomendado para menores de 12 anos'),
        ('44444444-4444-4444-4444-444444444444', '14', '14 anos', 'Não recomendado para menores de 14 anos'),
        ('55555555-5555-5555-5555-555555555555', '16', '16 anos', 'Não recomendado para menores de 16 anos'),
        ('66666666-6666-6666-6666-666666666666', '18', '18 anos', 'Não recomendado para menores de 18 anos')
      ON CONFLICT (code) DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO genres (id, name)
      VALUES
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ação'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Aventura'),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Comédia'),
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Drama'),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ficção Científica'),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Fantasia'),
        ('99999999-9999-9999-9999-999999999999', 'Terror'),
        ('12121212-1212-1212-1212-121212121212', 'Romance'),
        ('13131313-1313-1313-1313-131313131313', 'Animação')
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM movie_genres WHERE genreId IN (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '99999999-9999-9999-9999-999999999999',
        '12121212-1212-1212-1212-121212121212',
        '13131313-1313-1313-1313-131313131313'
      );
    `);

    await queryRunner.query(`
      DELETE FROM genres
      WHERE id IN (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '99999999-9999-9999-9999-999999999999',
        '12121212-1212-1212-1212-121212121212',
        '13131313-1313-1313-1313-131313131313'
      );
    `);

    await queryRunner.query(`
      DELETE FROM age_ratings
      WHERE id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666'
      );
    `);
  }
}
