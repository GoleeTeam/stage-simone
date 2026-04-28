## import in app.module
nest per sapere dell'esistenza di questo controller deve essere importato in app.module

code
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})

#### param, query e body

param -> identifica una risorsa -> GET /cats/42
query -> modifica una richiesta -> GET /cats?limit=10 || GET /cats?sort=asc || GET /cats?page=2
body -> creare o modificare i dati -> POST /users || PUT /products/5

#### query parameters
possiamo gestire le chiamate con delle query tramite l'inserimento del decorator @Query('queryName') methodName : type all'interno dei parametri che il metodo deve ricevere

code
@Get()
async findAll(@Query('name') name: string, @Query('age') age: number) {
  return `This action returns all cats filtered by name: ${name} and age: ${age}`;
}

tramite questa chiamata e l'inserimento di questi parametri arriviamo all'endpoint 
GET /cats?name=leffe&age=2

## esempio di controller completo

code

import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}

### import
Gli import servono a rendere disponibili:

- i decorator di NestJS (@Get, @Post, ecc.)
- le classi DTO definite nel progetto (CreateCatDto, UpdateCatDto, ListAllEntities)

I DTO servono a definire la struttura dei dati in ingresso e possono essere usati per validazione e tipizzazione.

### controller 
@Controller('cats')
questa riga crea l'endpoint cats. quindi per tutte le chiamate definite di seguito fatte a localhost:3000/cats (o al server che fa girare l'app) vengono gestite da questo controller.

HTTP request (get, post, put, delete)
        ↓
Nest matcha la route
        ↓
Decorator estrae dati:
   - @Param → URL
   - @Query → query string
   - @Body → JSON body
        ↓
Controller method
        ↓
Response

### classe CatsController
La classe contiene i metodi che gestiscono le richieste HTTP per la risorsa “cats”. 

#### Post Create
@Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

Viene eseguito quando arriva una richiesta: POST /cats
@Body() estrae il JSON dal body della richiesta e lo converte in un oggetto CreateCatDto. ritorna la stringa 'This action adds a new cat'.'

Client → POST /cats
        ↓
Body JSON
        ↓
@Body() → createCatDto
        ↓
Controller
        ↓
return risposta

#### Get findAll

code 
@Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

Viene eseguito quando arriva:GET /cats?limit=10
@Query() estrae i parametri dalla query string e li converte in un oggetto ListAllEntities
Ritorna una stringa che include il valore di limit.

GET /cats?limit=10
        ↓
@Query()
        ↓
query = { limit: 10 }
        ↓
controller
        ↓
risposta

#### Get findOne

code
@Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

Viene eseguito quando arriva: GET /cats/10
@Param('id') estrae il valore dalla URL.
ritorna una stringa con l'id

GET /cats/sas
        ↓
@Param('id')
        ↓
id = sas
        ↓
controller
        ↓
risposta

#### Put update

@Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

Viene eseguito quando arriva: PUT /cats/10
@Param('id') prende l’id dalla URL
@Body() prende il JSON dal body e lo converte in UpdateCatDto
ritorna una stringa con l'id del cat aggiornato

PUT /cats/sas
        ↓
@Param('id') → id = "sas"
        ↓
@Body() → updateCatDto
        ↓
controller
        ↓
risposta

#### delete remove

@Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }

Viene eseguito quando arriva: DELETE /cats/10
@Param('id') estrae l’id dalla URL.
ritorna una stringa con l'id inserito

DELETE /cats/sas
        ↓
Nest matcha la route /cats/:id
        ↓
@Param('id')
        ↓
id = sas
        ↓
controller
        ↓
risposta

### Riassunto generale
@Param() → prende dati dalla URL
@Query() → prende dati dalla query string
@Body() → prende dati dal body (JSON)
Controller → gestisce le richieste HTTP
DTO → definisce la struttura dei dati

## response
Per ora abbiamo visto come Nest restituisce automaticamente i dati usando return.
In alternativa, possiamo gestire direttamente la risposta HTTP tramite @Res() e l’oggetto Response di Express.
Per usarlo dobbiamo importare Res da @nestjs/common e il tipo Response da express.
In questo modo otteniamo accesso diretto all’oggetto response, che ci permette di controllare manualmente la risposta HTTP.
i metodi principali
- res.status() → imposta il codice di stato HTTP della risposta
- res.json() → invia una risposta in formato JSON
- res.send() → invia una risposta generica (testo, HTML o vuoto)

esempi

code
res.status(200).json({ message: 'ok' });