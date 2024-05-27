# Cattus API NodeJs

Repositório da API utilizada no Projeto Integrador de 2024-1.

## Instalação

    npm install

## Rodando a aplicação

    npm start
    
# CATTUS API

A seguir, algumas rotas já desenvolvidas.

## Obter lista de atividades

### Request

`GET /activity/select-all/:author_id`

    {{url_base}}/activity/select-all/66482c64ce8d1db7c0ae9458

### Response

    {
    "ok": true,
    "result": [
        {
            "activtyData": {
                "activityName": "Comeu",
                "activityStart": "2024-05-18T10:00:00.000Z",
                "activityEnd": "2024-05-18T11:00:00.000Z"
            },
            "_id": "664834f46fbc8f5869736ecf",
            "activityAuthor": {
                "petCharacteristics": {
                    "petType": "Cachorro",
                    "petBreed": "Pitbull",
                    "petSize": "Grande"
                },
                "_id": "66482c64ce8d1db7c0ae9458",
                "petName": "Farofa",
                "petBirth": "2020-05-15T00:00:00.000Z",
                "petEntry": "2022-04-20T00:00:00.000Z",
                "petGender": "Macho",
                "petComorbidities": "Nenhuma",
                "petObs": "Gosta de morder o pé das visitas",
                "petVaccCard": "Sim",
                "company": "66482c3bce8d1db7c0ae9456",
                "__v": 0
            },
            "__v": 0
        }
      ]
    }

## Criar uma nova atividade

### Request

`POST  /activity/create`

    {{url_base}}/activity/create

### Response

    {
      "ok": true,
      "message": "Atividade registrada com sucesso.",
      "_id": "664834f46fbc8f5869736ecf"
    }

## Obter uma atividade em específico

### Request

`GET /activity/:activity_id`

    {{url_base}}/activity/select-one/664834f46fbc8f5869736ecf

### Response

    {
      "ok": true,
      "result": {
          "activtyData": {
              "activityName": "Comeu",
              "activityStart": "2024-05-18T10:00:00.000Z",
              "activityEnd": "2024-05-18T11:00:00.000Z"
          },
          "_id": "664834f46fbc8f5869736ecf",
          "activityAuthor": {
              "petCharacteristics": {
                  "petType": "Cachorro",
                  "petBreed": "Pitbull",
                  "petSize": "Grande"
              },
              "_id": "66482c64ce8d1db7c0ae9458",
              "petName": "Farofa",
              "petBirth": "2020-05-15T00:00:00.000Z",
              "petEntry": "2022-04-20T00:00:00.000Z",
              "petGender": "Macho",
              "petComorbidities": "Nenhuma",
              "petObs": "Gosta de morder o pé das visitas",
              "petVaccCard": "Sim",
              "company": "66482c3bce8d1db7c0ae9456",
              "__v": 0
          },
          "__v": 0
      }
    }

## Get a non-existent Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/9999

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}
