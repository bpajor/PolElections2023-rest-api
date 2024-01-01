import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OkregiResult } from 'src/schemas/ResultsOkregi.schema';
import { WojewodztwaResult } from 'src/schemas/WojewodztwaResults.schema';
import { GminyResult } from 'src/schemas/GminyResult.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const token =
    process.env.TEST_TOKEN;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect(
        'Location',
        'http://localhost:3000/candidates/sejm?is_deputy=true',
      );
  });

  describe('/candidates/sejm/', () => {
    it('should return 400', () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('should return all 460 deputies', () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ is_deputy: true })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(460);
        });
    });
    it('should return all duputies who are men and have profession "lekarz"', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ is_deputy: true, sex: 'M', proffesion: 'lekarz' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(6);
        });
    });

    it('should return all candidates who are from list number 7 and okreg number 15', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ l_num: '7', o_num: '15', is_deputy: false })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(15);
        });
    });

    it('should return Paweł Piotr KUKIZ', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ c_pos: '1', o_num: '21', l_num: '4', is_deputy: false })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]['Nazwisko i imiona']).toEqual('Paweł Piotr KUKIZ');
        });
    });

    it('shuld return Janusz Marcin KOWALSKI', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ c_pos: '4', o_num: '21', l_num: '4', is_deputy: false })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]['Nazwisko i imiona']).toEqual(
            'Janusz Marcin KOWALSKI',
          );
        });
    });
    it('should return false', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ min_vote_num: 100000, is_deputy: true })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(
            res.body.some(
              (candidate: {}) => candidate['Liczba głosów'] < 100000,
            ),
          ).toBeFalsy();
        });
    });

    it('should return 404', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ min_vote_num: 100000000, is_deputy: true })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual('No candidates found');
        });
    });

    it('should return 401', async () => {
      return request(app.getHttpServer())
        .get('/candidates/sejm')
        .query({ min_vote_num: 100000000, is_deputy: true })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('/candidates/senat/', () => {
    it('should return all senators', async () => {
      return request(app.getHttpServer())
        .get('/candidates/senat')
        .query({ is_deputy: true })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(100);
        });
    });

    it('should return all senators who are women and have proffesion nauczyciel', async () => {
      return request(app.getHttpServer())
        .get('/candidates/senat')
        .query({ is_deputy: true, sex: 'K', proffesion: 'nauczyciel' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(
            res.body.some((candidate: {}) => candidate['Płeć'] === 'Mężczyzna'),
          ).toBeFalsy();
          expect(
            res.body.some(
              (candidate: {}) => candidate['Zawód'] !== 'nauczyciel',
            ),
          ).toBeFalsy();
        });
    });

    it('should return Adam Piotr BODNAR', async () => {
      return request(app.getHttpServer())
        .get('/candidates/senat')
        .query({ is_deputy: true, min_vote_num: 500000 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]['Nazwisko i imiona']).toEqual('Adam Piotr BODNAR');
        });
    });

    it('should return 404', async () => {
      return request(app.getHttpServer())
        .get('/candidates/senat')
        .query({ min_vote_num: 100000000, is_deputy: true })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual('No candidates found');
        });
    });

    it('should return 401', async () => {
      return request(app.getHttpServer())
        .get('/candidates/senat')
        .query({ min_vote_num: 100000000, is_deputy: true })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('/results/okregi', () => {
    it('should return all okregi of total length 41', () => {
      return request(app.getHttpServer())
        .get('/results/okregi')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(41);
        });
    });

    it('should return 3 okregi with o_num=1,2,3', () => {
      const okregi = [1, 2, 3];
      return request(app.getHttpServer())
        .get('/results/okregi')
        .query({ o_num: '1,2,3' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(3);
          expect(
            res.body.every((okreg: {}) => okregi.includes(okreg['Nr okręgu'])),
          ).toBeTruthy();
        });
    });

    it('should return 26 okregi with params: min_attendance_percent=70 and max_invalid_votes_percent=2', () => {
      return request(app.getHttpServer())
        .get('/results/okregi')
        .query({ min_attendance_percent: 70, max_invalid_votes_percent: 2 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          console.log('length: ', res.body.length);
          expect(res.body).toHaveLength(26);
          for (const okreg of res.body) {
            if (okreg['Frekwencja'] < 70) {
              console.log('attendance too low!');
            }
            if (okreg['Procent głosów nieważnych'] > 2) {
              console.log('invalid votes too high!');
            }
          }
          expect(
            res.body.every(
              (okreg: OkregiResult) =>
                Number(okreg['Frekwencja'].replace(',', '.')) >= 70 &&
                Number(okreg['Procent głosów nieważnych'].replace(',', '.')) <=
                  2,
            ),
          ).toBeTruthy();
        });
    });

    it('should return 404', () => {
      return request(app.getHttpServer())
        .get('/results/okregi')
        .query({ min_attendance_percent: 100, max_invalid_votes_percent: 0 })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual(
            'No results match the provided parameters',
          );
        });
    });

    it('should return 401', () => {
      return request(app.getHttpServer())
        .get('/results/okregi')
        .query({ min_attendance_percent: 100, max_invalid_votes_percent: 0 })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('/results/wojewodztwa', () => {
    it('should return all wojewodztwa of total length 16', () => {
      return request(app.getHttpServer())
        .get('/results/wojewodztwa')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(16);
        });
    });

    it('should return 3 wojewodztwa: małopolskie, śląskie, pomorskie', () => {
      const wojewodztwa = ['małopolskie', 'śląskie', 'pomorskie'];
      return request(app.getHttpServer())
        .get('/results/wojewodztwa')
        .query({ woj: 'małopolskie,śląskie,pomorskie' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(3);
          expect(
            res.body.every((wojewodztwo: WojewodztwaResult) =>
              wojewodztwa.includes(wojewodztwo['Województwo']),
            ),
          ).toBeTruthy();
        });
    });

    it('should return 6 wojewodztwa with params: min_attendance_percent=72 and max_invalid_votes_percent=2', () => {
      return request(app.getHttpServer())
        .get('/results/wojewodztwa')
        .query({ min_attendance_percent: 72, max_invalid_votes_percent: 2 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(6);
          expect(
            res.body.every(
              (wojewodztwo: WojewodztwaResult) =>
                Number(wojewodztwo['Frekwencja'].replace(',', '.')) >= 72 &&
                Number(
                  wojewodztwo['Procent głosów nieważnych'].replace(',', '.'),
                ) <= 2,
            ),
          ).toBeTruthy();
        });
    });

    it('should return 404', () => {
      return request(app.getHttpServer())
        .get('/results/wojewodztwa')
        .query({ min_attendance_percent: 100, max_invalid_votes_percent: 0 })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual(
            'No results match the provided parameters',
          );
        });
    });

    it('should return 401', () => {
      return request(app.getHttpServer())
        .get('/results/wojewodztwa')
        .query({ min_attendance_percent: 100, max_invalid_votes_percent: 0 })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('/results/powiaty', () => {
    it('should return all powiaty of total length 382', () => {
      return request(app.getHttpServer())
        .get('/results/powiaty')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(382);
        });
    });

    it('should return 3 powiaty: powiat krakowski, powiat wadowicki, powiat nowosądecki', () => {
      const powiaty = ['krakowski', 'wadowicki', 'nowosądecki'];
      return request(app.getHttpServer())
        .get('/results/powiaty')
        .query({ pow: 'krakowski,wadowicki,nowosądecki' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(3);
          expect(
            res.body.every((powiat: {}) => powiaty.includes(powiat['Powiat'])),
          ).toBeTruthy();
        });
    });

    it('should return 404', () => {
      return request(app.getHttpServer())
        .get('/results/powiaty')
        .query({
          pow: 'krakowski,wadowicki,nowosądecki,nowotarski',
          woj: 'pomorskie',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual(
            'No results match the provided parameters',
          );
        });
    });

    it('should return powiaty of total length 226 with attendance percent >= 70', () => {
      return request(app.getHttpServer())
        .get('/results/powiaty')
        .query({ min_attendance_percent: 70 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(226);
          expect(
            res.body.every(
              (powiat: {}) =>
                Number(powiat['Frekwencja'].replace(',', '.')) >= 70,
            ),
          ).toBeTruthy();
        });
    });

    it('should return powiaty of total length 29 and invalid votes percent <= 2 and woj=małopolskie,pomorskie', () => {
      return request(app.getHttpServer())
        .get('/results/powiaty')
        .query({ max_invalid_votes_percent: 2, woj: 'małopolskie,pomorskie' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(29);
          expect(
            res.body.every(
              (powiat: {}) =>
                Number(powiat['Procent głosów nieważnych'].replace(',', '.')) <=
                  2 &&
                ['małopolskie', 'pomorskie'].includes(powiat['Województwo']),
            ),
          ).toBeTruthy();
        });
    });

    it('should return 401', () => {
      return request(app.getHttpServer())
        .get('/results/powiaty')
        .query({ min_attendance_percent: 100, max_invalid_votes_percent: 0 })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('/results/gminy', () => {
    it('should return all gminy of total length 2583', () => {
      return request(app.getHttpServer())
        .get('/results/gminy')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2583);
        });
    });

    it('should return 219 gminy with params: min_attendance_percent=80', () => {
      return request(app.getHttpServer())
        .get('/results/gminy')
        .query({ min_attendance_percent: 80 })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(219);
          expect(
            res.body.every(
              (gmina: {}) =>
                Number(gmina['Frekwencja'].replace(',', '.')) >= 80,
            ),
          ).toBeTruthy();
        });
    });

    it('should return 47 gminy with params: pow=bocheński,tarnowski,lęborski,krakowski,wrocławski and o_num=15,13,26,27', () => {
      return request(app.getHttpServer())
        .get('/results/gminy')
        .query({
          pow: 'bocheński,tarnowski,lęborski,krakowski,wrocławski',
          o_num: '15,13,26,27',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(47);
          expect(
            res.body.every(
              (gmina: GminyResult) =>
                [
                  'bocheński',
                  'tarnowski',
                  'lęborski',
                  'krakowski',
                  'wrocławski',
                ].includes(gmina['Powiat']) &&
                ['15', '13', '26', '27'].includes(
                  gmina['Nr okręgu'].toString(),
                ),
            ),
          ).toBeTruthy();
        });
    });

    it('should return 404', () => {
      return request(app.getHttpServer())
        .get('/results/gminy')
        .query({ pow: 'bocheński', o_num: '30' })
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual(
            'No results match the provided parameters',
          );
        });
    });

    it('should return 401', () => {
      return request(app.getHttpServer())
        .get('/results/gminy')
        .query({ min_attendance_percent: 100, max_invalid_votes_percent: 0 })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('/auth/signup', () => {
    const dto = { email: 'test@test.com' };
    it('should return 201', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });
  });

  it('should return 403', () => {
    const dto = { email: 'test@test.com' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(dto)
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toEqual('User already exists');
      });
  })

  describe('/auth/get-new-token', () => {
    const dto = { email: 'test@test.com'};
    it('should return 201', () => {
      return request(app.getHttpServer())
        .post('/auth/get-new-token')
        .send(dto)
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });

    it('should return 403', () => {
      const dto = { email: 'testtest@test.com' }
      return request(app.getHttpServer())
        .post('/auth/get-new-token')
        .send(dto)
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toEqual('User does not exist');
        });
    })
  });

  afterAll(async () => {
    const mongoose = app.get(getModelToken('User'));
    await mongoose.deleteOne({ email: 'test@test.com' });
  });
});
