import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Cat } from '../src/cats/domain/cat.class';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { CatsController, CATS_SERVICE } from '../src/cats/cats.controller';
import { CatsService, CATS_REPOSITORY } from '../src/cats/cats.service';
import { GattiController } from '../src/cats/gatti.controller';
import { CatsMongoRepository } from '../src/cats/repo/catsMongo.repository';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CatDocument, CatSchema } from '../src/cats/schemas/cat.schema';
import { Connection, Model } from 'mongoose';
import { webcrypto } from 'crypto';

describe('CatsController + GattiController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let catModel: Model<CatDocument>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/cats-e2e-test'),
        MongooseModule.forFeature([
          {
            name: Cat.name,
            schema: CatSchema,
          },
        ]),
      ],
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

    connection = moduleFixture.get<Connection>(getConnectionToken());
    catModel = moduleFixture.get<Model<CatDocument>>(getModelToken(Cat.name));
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

  beforeEach(async () => {
    await catModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
  });

  describe('/cats', () => {
  const notExistingUuid = '11111111-1111-4111-8111-111111111111';

  it('segue la storia CRUD completa per /cats', async () => {
    await request(app.getHttpServer()).get('/cats').expect(200).expect([]);

    await request(app.getHttpServer())
      .post('/cats')
      .send({
        name: '',
        age: 'two',
        color: 'purple',
      })
      .expect(400);

    const gatto1Res = await request(app.getHttpServer())
      .post('/cats')
      .send({
        name: 'leffe',
        age: 2,
        color: 'orange',
      })
      .expect(201);

    expect(gatto1Res.body).toEqual({
      message: 'cat created',
      id: expect.any(String),
    });

    const gatto1 = {
      id: gatto1Res.body.id,
      name: 'leffe',
      age: 2,
      color: 'orange',
    };

    await request(app.getHttpServer())
      .get(`/cats/${gatto1.id}`)
      .expect(200)
      .expect(gatto1);

    await request(app.getHttpServer()).get('/cats/not-a-uuid').expect(400);

    await request(app.getHttpServer())
      .get(`/cats/${notExistingUuid}`)
      .expect(404);

    await request(app.getHttpServer()).get('/cats').expect(200).expect([gatto1]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'white' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'orange' })
      .expect(200)
      .expect([gatto1]);

    await request(app.getHttpServer()).get('/cats/search').expect(400);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'purple' })
      .expect(400);

    const gatto2Res = await request(app.getHttpServer())
      .post('/cats')
      .send({
        name: 'due',
        age: 14,
        color: 'black',
      })
      .expect(201);

    expect(gatto2Res.body).toEqual({
      message: 'cat created',
      id: expect.any(String),
    });

    const gatto2 = {
      id: gatto2Res.body.id,
      name: 'due',
      age: 14,
      color: 'black',
    };

    await request(app.getHttpServer())
      .get(`/cats/${gatto2.id}`)
      .expect(200)
      .expect(gatto2);

    await request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect([gatto1, gatto2]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'white' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'orange' })
      .expect(200)
      .expect([gatto1]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'black' })
      .expect(200)
      .expect([gatto2]);

    await request(app.getHttpServer())
      .put(`/cats/${gatto2.id}`)
      .send({
        name: 'due',
        age: 14,
        color: 'orange',
      })
      .expect(200)
      .expect({
        message: 'cat updated',
        id: gatto2.id,
      });

    const gatto2Updated = {
      ...gatto2,
      color: 'orange',
    };

    await request(app.getHttpServer())
      .put('/cats/not-a-uuid')
      .send({
        name: 'due',
        age: 14,
        color: 'orange',
      })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/cats/${notExistingUuid}`)
      .send({
        name: 'ghost',
        age: 99,
        color: 'white',
      })
      .expect(404);

    await request(app.getHttpServer())
      .put(`/cats/${gatto2.id}`)
      .send({
        name: '',
        age: 'wrong',
        color: 'purple',
      })
      .expect(400);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'orange' })
      .expect(200)
      .expect([gatto1, gatto2Updated]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'black' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .delete(`/cats/${gatto2.id}`)
      .expect(200)
      .expect({
        message: 'Cat deleted',
        id: gatto2.id,
      });

    await request(app.getHttpServer()).delete('/cats/not-a-uuid').expect(400);

    await request(app.getHttpServer())
      .delete(`/cats/${notExistingUuid}`)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/cats/${gatto1.id}`)
      .expect(200)
      .expect(gatto1);

    await request(app.getHttpServer()).get(`/cats/${gatto2.id}`).expect(404);

    await request(app.getHttpServer()).get('/cats').expect(200).expect([gatto1]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'white' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'orange' })
      .expect(200)
      .expect([gatto1]);

    await request(app.getHttpServer())
      .get('/cats/search')
      .query({ color: 'black' })
      .expect(200)
      .expect([]);
  });
});

describe('/gatti', () => {
  const notExistingUuid = '22222222-2222-4222-8222-222222222222';

  it('segue la storia CRUD completa per /gatti', async () => {
    await request(app.getHttpServer()).get('/gatti').expect(200).expect([]);

    await request(app.getHttpServer())
      .post('/gatti')
      .send({
        nome: '',
        eta: 'due',
        colore: 'viola',
      })
      .expect(400);

    const gatto1Res = await request(app.getHttpServer())
      .post('/gatti')
      .send({
        nome: 'leffe',
        eta: 2,
        colore: 'arancione',
      })
      .expect(201);

    expect(gatto1Res.body).toEqual({
      message: 'cat created',
      id: expect.any(String),
    });

    const gatto1 = {
      id: gatto1Res.body.id,
      name: 'leffe',
      age: 2,
      color: 'orange',
    };

    await request(app.getHttpServer())
      .get(`/gatti/${gatto1.id}`)
      .expect(200)
      .expect(gatto1);

    await request(app.getHttpServer()).get('/gatti/not-a-uuid').expect(400);

    await request(app.getHttpServer())
      .get(`/gatti/${notExistingUuid}`)
      .expect(404);

    await request(app.getHttpServer()).get('/gatti').expect(200).expect([gatto1]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'bianco' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'arancione' })
      .expect(200)
      .expect([gatto1]);

    await request(app.getHttpServer()).get('/gatti/cerca').expect(400);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'viola' })
      .expect(400);

    const gatto2Res = await request(app.getHttpServer())
      .post('/gatti')
      .send({
        nome: 'due',
        eta: 14,
        colore: 'nero',
      })
      .expect(201);

    const gatto2 = {
      id: gatto2Res.body.id,
      name: 'due',
      age: 14,
      color: 'black',
    };

    await request(app.getHttpServer())
      .get(`/gatti/${gatto2.id}`)
      .expect(200)
      .expect(gatto2);

    await request(app.getHttpServer())
      .get('/gatti')
      .expect(200)
      .expect([gatto1, gatto2]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'bianco' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'arancione' })
      .expect(200)
      .expect([gatto1]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'nero' })
      .expect(200)
      .expect([gatto2]);

    await request(app.getHttpServer())
      .put(`/gatti/${gatto2.id}`)
      .send({
        nome: 'due',
        eta: 14,
        colore: 'arancione',
      })
      .expect(200)
      .expect({
        message: 'cat updated',
        id: gatto2.id,
      });

    const gatto2Updated = {
      ...gatto2,
      color: 'orange',
    };

    await request(app.getHttpServer())
      .put('/gatti/not-a-uuid')
      .send({
        nome: 'due',
        eta: 14,
        colore: 'arancione',
      })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/gatti/${notExistingUuid}`)
      .send({
        nome: 'ghost',
        eta: 99,
        colore: 'bianco',
      })
      .expect(404);

    await request(app.getHttpServer())
      .put(`/gatti/${gatto2.id}`)
      .send({
        nome: '',
        eta: 'wrong',
        colore: 'viola',
      })
      .expect(400);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'arancione' })
      .expect(200)
      .expect([gatto1, gatto2Updated]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'nero' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .delete(`/gatti/${gatto2.id}`)
      .expect(200)
      .expect({
        message: 'Cat deleted',
        id: gatto2.id,
      });

    await request(app.getHttpServer()).delete('/gatti/not-a-uuid').expect(400);

    await request(app.getHttpServer())
      .delete(`/gatti/${notExistingUuid}`)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/gatti/${gatto1.id}`)
      .expect(200)
      .expect(gatto1);

    await request(app.getHttpServer()).get(`/gatti/${gatto2.id}`).expect(404);

    await request(app.getHttpServer()).get('/gatti').expect(200).expect([gatto1]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'bianco' })
      .expect(200)
      .expect([]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'arancione' })
      .expect(200)
      .expect([gatto1]);

    await request(app.getHttpServer())
      .get('/gatti/cerca')
      .query({ color: 'nero' })
      .expect(200)
      .expect([]);
  });
});
});
