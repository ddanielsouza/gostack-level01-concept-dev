const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const size = parseInt(Math.random() * 9) + 1;

for(let i = 0; i < size; i++){
  repositories.push({
    id: uuid(), 
    title: `Title ${i}`, 
    url: `https://${uuid()}/`, 
    techs: [], 
    likes: parseInt(Math.random() * 50)
  })
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories); 
});

app.post("/repositories", (request, response) => {  
  const { title, url, techs } = request.body;
  const errorsBody = [];

  title ? null :    errorsBody.push('title is required');
  url   ? null :    errorsBody.push('url is required');
  techs ? null :    errorsBody.push('techs is required');

  if(errorsBody.length === 0){
    const repository = { id: uuid(), title, url, techs, likes: 0 };
    repositories.push(repository);

    return response.status(201).json(repository);
  }
  else{
    return response.status(400).json({error: errorsBody.join('; ')})
  }
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = repositories.find(r => r.id === request.params.id);
  
  if(repository){
    title ? repository.title  = title : null;
    url   ? repository.url    = url   : null;
    techs ? repository.techs  = techs : null;

    return response.status(200).json(repository);
  }
  else{
    return response.status(400).json({error: 'Repository not exists'})
  }
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = repositories.findIndex(r => r.id === request.params.id);

  if(repositoryIndex >= 0){
    repositories.splice(repositoryIndex, 1);
    response.status(204).send();
  }
  else{
    return response.status(400).json({error: 'Repository not exists'})
  }

});

app.post("/repositories/:id/like", (request, response) => {
  const repository= repositories.find(r => r.id === request.params.id);

  if(repository){
    repository.likes ++;
    response.status(201).json(repository);
  }
  else{
    return response.status(400).json({error: 'Repository not exists'})
  }
});

module.exports = app;
