import express from 'express';
import bodyParser from 'body-parser'
import {Configuration, OpenAIApi} from 'openai'

import livereload from 'livereload'
const liveReloadServer = livereload.createServer({extraExts: ['jade']});
liveReloadServer.watch(['./public', './views']);

import * as dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}))

const app = express()
const port = 3000

app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', async function (req, res) {
  res.render('index');
});

app.post('/generate', async function (req, res) {
  
  const messages = [
    {role: 'system', content: 'You are a diagram generator using mermaid language. You will only respond with a mermaid script. Don\' give any explanation. Respond as short as possible'},
    {role: 'user', content: 'class diagram with ObjectA and his child ObjectB'},
    {role: 'assistant', content: '```mermaid\nclassDiagram\n    ObjectA <|-- ObjectB\n```'},
  ]

  messages.push(...req.body)
  
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.8,
  })
  
  let result = completion.data.choices[0].message?.content
  .replace('```mermaid\n', '')
  .replace('```', '');
  
  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})