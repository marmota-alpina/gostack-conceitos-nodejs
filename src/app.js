const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checksRepositoryExists = (request, response, next) =>{
  const {id} = request.params;
  if(!id){
    return response.status(400).send('Invalid request, id is must required!');
  }

  if(!isUuid(id)){
    return response.status(400).send('Invalid id!');
  }
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex<0){
    return response.status(400).json('Repository not found!');
  }
    
  return next();
};
app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes:0}
  repositories.push(repository)
  return response.status(201).json(repository);
});

app.put("/repositories/:id",checksRepositoryExists, (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  delete request.body.id;
  delete request.body.likes;
  const oldRepository = repositories[repositoryIndex]; 
  const updatadeRepository = {...oldRepository, ...request.body}
  repositories[repositoryIndex] = updatadeRepository;
  return response.send(updatadeRepository);
});

app.delete("/repositories/:id", checksRepositoryExists, (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
 
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like",checksRepositoryExists, (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  delete request.body.id;
  delete request.body.likes;
  const oldRepository = repositories[repositoryIndex]; 
  const updatadeRepository = {...oldRepository, likes: oldRepository.likes+1}
  repositories[repositoryIndex] = updatadeRepository;
  return response.status(201).send(updatadeRepository);
});

module.exports = app;
