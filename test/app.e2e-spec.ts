import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTcwYzgwZWM1OTVmMDNhYzAzMWQwZDgiLCJlbWFpbCI6InRlc3QxMjMrMjFAZ21haWwuY29tIiwiaWF0IjoxNzAxODkwMDYyLCJleHAiOjE3MDQ0ODIwNjJ9.H7FzTmgKkzBs3XdSlDZowQSFEet_ePb_hncpuhAn8Vc';

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
  });
});

//     it('shuld return Janusz Marcin KOWALSKI', async () => {
//       const params: paramsDto = createParams({
//         c_pos: '4',
//         o_num: '21',
//         l_num: '4',
//       });
//       const sejmCandidates = await service.getCandidates(params, 'sejm');
//       expect(sejmCandidates).toHaveLength(1);
//       expect(sejmCandidates[0]['Nazwisko i imiona']).toEqual(
//         'Janusz Marcin KOWALSKI',
//       );
//     });
//     it('should return false', async () => {
//       const params: paramsDto = createParams({ min_vote_num: 100000 });
//       const sejmCandidates = await service.getCandidates(params, 'sejm');
//       expect(
//         sejmCandidates.some((candidate) => candidate['Liczba głosów'] < 100000),
//       ).toBeFalsy();
//     });
//   });
//   describe('getSenatCandidates', () => {
//     it('should return all senators', async () => {
//       const params: paramsDto = createParams({}, true);
//       const senatCandidates = await service.getCandidates(params, 'senat');
//       expect(senatCandidates).toHaveLength(100);
//     });

//     it('should return all senators who are women and have proffesion nauczyciel', async () => {
//       const params: paramsDto = createParams(
//         { sex: 'Kobieta', proffesion: 'nauczyciel' },
//         true,
//       );
//       const senatCandidates = await service.getCandidates(params, 'senat');
//       expect(senatCandidates).toHaveLength(2);
//       expect(
//         senatCandidates.some((candidate) => candidate['Płeć'] === 'Mężczyzna'),
//       ).toBeFalsy();
//       expect(
//         senatCandidates.some(
//           (candidate) => candidate['Zawód'] !== 'nauczyciel',
//         ),
//       ).toBeFalsy();
//     });
//     it('should return Adam Piotr BODNAR', async () => {
//       const params: paramsDto = createParams({
//         min_vote_num: 500000,
//       });
//       const senatCandidates = await service.getCandidates(params, 'senat');
//       expect(senatCandidates).toHaveLength(1);
//       expect(senatCandidates[0]['Nazwisko i imiona']).toEqual(
//         'Adam Piotr BODNAR',
//       );
//     });
//   });
// });
