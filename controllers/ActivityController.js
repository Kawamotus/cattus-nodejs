import express from 'express';
import middlewares from '../middlewares/middlewares.js';

import ActivityServices from '../services/ActivityServices.js';
import Activity from '../models/activity.js';

const router = express.Router();

router.post(
  '/create',
  middlewares.checkNecessaryFields(Activity),
  (req, res) => {
    const data = req.body;

    const operation = ActivityServices.Create(data);
    operation
      .then((result) => {
        res.status(201).send({
          ok: true,
          message: 'Atividade registrada com sucesso.',
          _id: result._id,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({
          message: 'Erro ao registrar atividade.',
        });
      });
  },
);

router.get('/select-all/:author_id', (req, res) => {
  const operation = ActivityServices.SelectAll(req.params.author_id);

  operation
    .then((result) => {
      res.send({
        ok: true,
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao listar as atividades.',
      });
    });
});

router.get('/select-all-camera/:camera_id', (req, res) => {
  const operation = ActivityServices.SelectAllByCamera(req.params.camera_id);

  operation
    .then((result) => {
      res.send({
        ok: true,
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao listar as atividades.',
      });
    });
});

router.get('/select-one/:activity_id', (req, res) => {
  const operation = ActivityServices.SelectOne(req.params.activity_id);

  operation
    .then((result) => {
      res.send({
        ok: true,
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao listar a atividade.',
      });
    });
});

router.delete('/delete/:activity_id', (req, res) => {
  const operation = ActivityServices.Delete(req.params.activity_id);

  operation
    .then((result) => {
      res.status(204).send({
        ok: true,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao deletar a atividade.',
      });
    });
});

router.get('/charts/average-animal-activity/:interval', async (req, res) => {
  const company = req.session.user.company;
  const interval = req.params.interval;

  try {
    const [result] = await ActivityServices.SelectAverageActivitiesTime(
      company,
      interval,
    );
    res.send({ intervalo: interval, result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Erro interno no servidor.' });
  }
});

router.get('/select-by-camera/:camera_id', (req, res) => {
  const operation = ActivityServices.SelectByCameraId(req.params.camera_id);

  operation
    .then((result) => {
      res.send({
        ok: true,
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao listar as atividades dessa câmera.',
      });
    });
});

router.get('/select-by-company/:company_id', (req, res) => {
  const companyId = req.params.company_id;
  const { skip = 0, limit = 20 } = req.query;

  const operation =
    skip || limit
      ? ActivityServices.SelectByCompanyIdPaginated(
          companyId,
          parseInt(skip),
          parseInt(limit),
        )
      : ActivityServices.SelectByCompanyId(companyId);

  operation
    .then((result) => {
      res.send({
        ok: true,
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao listar as atividades dessa companhia.',
      });
    });
});

router.get('/latest-by-company/:company_id', (req, res) => {
  const companyId = req.params.company_id;
  const limit = parseInt(req.query.limit) || 10;

  const operation = ActivityServices.SelectByCompanyIdPaginated(
    companyId,
    0,
    limit,
  );

  operation
    .then((result) => {
      res.send({
        ok: true,
        result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({
        message: 'Erro ao listar as atividades recentes dessa companhia.',
      });
    });
});

export default router;
