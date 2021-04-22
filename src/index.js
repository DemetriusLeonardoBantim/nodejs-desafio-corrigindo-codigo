const express = require('express');

const { v4: uuid, validade: isUuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

function checkUserExist(request, response, next) {
  const { id } = request.headers;
  const repository = repositories.find((user) => user.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  request.repository = repository;
  return next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(404).json({ error: 'Repository does not exists' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(404).json({ error: 'Repository does not exists' });
  }

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex]);
});

module.exports = app;
