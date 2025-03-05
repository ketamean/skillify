import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
//For env File 
dotenv.config();
import supabaseInstance from './configs/database/client'

const app: Application = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
}); 