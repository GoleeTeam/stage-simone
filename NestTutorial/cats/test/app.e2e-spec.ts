import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { CatsController, CATS_SERVICE } from '../src/cats/cats.controller';
import { CatsService, CATS_REPOSITORY } from '../src/cats/cats.service';
import { GattiController } from '../src/cats/gatti.controller';
import { CatsFakeRepository } from '../src/cats/repo/catsFake.repository';
import { CatsInMemoryRepository } from '../src/cats/repo/catsInMemory.repository';
import { CatsMongoRepository } from '../src/cats/repo/catsMongo.repository';

describe('CatsController + GattiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CatsController, GattiController],
      providers: [
        {
          provide: CATS_SERVICE,
          useClass: CatsService,
        },
        {
          provide: CATS_REPOSITORY,
          useClass: CatsMongoRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/cats', () => {
    it('GET /cats ritorna lista vuota iniziale', async () => {
      await request(app.getHttpServer()).get('/cats').expect(200).expect([]);
    });

    it('POST /cats crea un gatto con payload inglese', async () => {
      const res = await request(app.getHttpServer())
        .post('/cats')
        .send({
          name: 'Milo',
          age: 3,
          color: 'white',
        })
        .expect(201);

      expect(res.body).toEqual({
        message: 'cat created',
        id: expect.any(String),
      });
    });

    it('GET /cats/:id ritorna il gatto creato', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/cats')
        .send({
          name: 'Milo',
          age: 3,
          color: 'white',
        })
        .expect(201);

      await request(app.getHttpServer())
        .get(`/cats/${createRes.body.id}`)
        .expect(200)
        .expect({
          id: createRes.body.id,
          name: 'Milo',
          age: 3,
          color: 'white',
        });
    });

    it('GET /cats/search filtra per colore inglese', async () => {
      await request(app.getHttpServer()).post('/cats').send({
        name: 'Milo',
        age: 3,
        color: 'white',
      });

      await request(app.getHttpServer()).post('/cats').send({
        name: 'Nero',
        age: 4,
        color: 'black',
      });

      const res = await request(app.getHttpServer())
        .get('/cats/search')
        .query({ color: 'white' })
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({
        name: 'Milo',
        age: 3,
        color: 'white',
      });
    });

    it('PUT /cats/:id aggiorna un gatto', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/cats')
        .send({
          name: 'Milo',
          age: 3,
          color: 'white',
        })
        .expect(201);

      await request(app.getHttpServer())
        .put(`/cats/${createRes.body.id}`)
        .send({
          name: 'Milo Updated',
          age: 5,
          color: 'gray',
        })
        .expect(200)
        .expect({
          message: 'cat updated',
          id: createRes.body.id,
        });

      await request(app.getHttpServer())
        .get(`/cats/${createRes.body.id}`)
        .expect(200)
        .expect({
          id: createRes.body.id,
          name: 'Milo Updated',
          age: 5,
          color: 'gray',
        });
    });

    it('DELETE /cats/:id elimina un gatto', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/cats')
        .send({
          name: 'Milo',
          age: 3,
          color: 'white',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/cats/${createRes.body.id}`)
        .expect(200)
        .expect({
          message: 'Cat deleted',
          id: createRes.body.id,
        });

      await request(app.getHttpServer())
        .get(`/cats/${createRes.body.id}`)
        .expect(404);
    });

    it('valida uuid non valido su GET /cats/:id', async () => {
      await request(app.getHttpServer()).get('/cats/not-a-uuid').expect(400);
    });

    it('valida body non valido su POST /cats', async () => {
      await request(app.getHttpServer())
        .post('/cats')
        .send({
          name: '',
          age: 'three',
          color: 'purple',
        })
        .expect(400);
    });
  });

  describe('/gatti', () => {
    it('GET /gatti ritorna lista vuota iniziale', async () => {
      await request(app.getHttpServer()).get('/gatti').expect(200).expect([]);
    });

    it('POST /gatti crea un gatto con payload italiano', async () => {
      const res = await request(app.getHttpServer())
        .post('/gatti')
        .send({
          nome: 'Micio',
          eta: 2,
          colore: 'bianco',
        })
        .expect(201);

      expect(res.body).toEqual({
        message: 'cat created',
        id: expect.any(String),
      });
    });

    it('GET /gatti/:id ritorna il gatto creato mappato in formato interno', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/gatti')
        .send({
          nome: 'Micio',
          eta: 2,
          colore: 'bianco',
        })
        .expect(201);

      await request(app.getHttpServer())
        .get(`/gatti/${createRes.body.id}`)
        .expect(200)
        .expect({
          id: createRes.body.id,
          name: 'Micio',
          age: 2,
          color: 'white',
        });
    });

    it('GET /gatti/cerca filtra per colore italiano', async () => {
      await request(app.getHttpServer()).post('/gatti').send({
        nome: 'Micio',
        eta: 2,
        colore: 'bianco',
      });

      await request(app.getHttpServer()).post('/gatti').send({
        nome: 'Nerino',
        eta: 4,
        colore: 'nero',
      });

      const res = await request(app.getHttpServer())
        .get('/gatti/cerca')
        .query({ color: 'bianco' })
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({
        name: 'Micio',
        age: 2,
        color: 'white',
      });
    });

    it('PUT /gatti/:id aggiorna un gatto con payload italiano', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/gatti')
        .send({
          nome: 'Micio',
          eta: 2,
          colore: 'bianco',
        })
        .expect(201);

      await request(app.getHttpServer())
        .put(`/gatti/${createRes.body.id}`)
        .send({
          nome: 'Micio Updated',
          eta: 6,
          colore: 'grigio',
        })
        .expect(200)
        .expect({
          message: 'cat updated',
          id: createRes.body.id,
        });

      await request(app.getHttpServer())
        .get(`/gatti/${createRes.body.id}`)
        .expect(200)
        .expect({
          id: createRes.body.id,
          name: 'Micio Updated',
          age: 6,
          color: 'gray',
        });
    });

    it('DELETE /gatti/:id elimina un gatto', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/gatti')
        .send({
          nome: 'Micio',
          eta: 2,
          colore: 'bianco',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/gatti/${createRes.body.id}`)
        .expect(200)
        .expect({
          message: 'Cat deleted',
          id: createRes.body.id,
        });

      await request(app.getHttpServer())
        .get(`/gatti/${createRes.body.id}`)
        .expect(404);
    });

    it('valida body non valido su POST /gatti', async () => {
      await request(app.getHttpServer())
        .post('/gatti')
        .send({
          nome: '',
          eta: 'due',
          colore: 'viola',
        })
        .expect(400);
    });

    it('valida uuid non valido su GET /gatti/:id', async () => {
      await request(app.getHttpServer()).get('/gatti/not-a-uuid').expect(400);
    });
  });
});
