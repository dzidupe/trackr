import { Request, Response, NextFunction, Router } from "express";
import dbController from "../controllers/db.controller";

const apiRouter = Router();


/* 
  Routes needed:
  /job
    POST - create
    DELETE - delete
    READ - read
  /interview
    POST - create
    DELETE - delete
    READ - read
  /comment
    POST - create
    DELETE - delete
    READ - read
*/

apiRouter.get('/job', dbController.getAllPreviews,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(`Success: ${JSON.stringify(res.locals.rows)}`);
});

apiRouter.post('/job', dbController.createNode, (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(`Success! ID: ${res.locals.id}`);
});

apiRouter.delete('/job', (req: Request, res: Response, next: NextFunction) => {
    
});



apiRouter.get('/interview', (req: Request, res: Response, next: NextFunction) => {
    
});

apiRouter.post('/interview', dbController.createNode, (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(`Interview creation success! ${res.locals.id}`);
});

apiRouter.delete('/interview', (req: Request, res: Response, next: NextFunction) => {
    
});



apiRouter.get('/comment', (req: Request, res: Response, next: NextFunction) => {
    
});

apiRouter.post('/comment', dbController.createNode, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(`Comment creation success! ${res.locals.id}`);
});

apiRouter.delete('/comment', (req: Request, res: Response, next: NextFunction) => {
    
});




export default apiRouter;