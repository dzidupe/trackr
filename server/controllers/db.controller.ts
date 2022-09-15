import trackrDB from "../models/nodeModels";
import { Request, Response, NextFunction } from "express";
import { type } from "os";

interface DBCInterface {
  getAllPreviews: (req: Request, res: Response, next: NextFunction) => void;
  createNode: (req: Request, res: Response, next: NextFunction) => void;
  deleteNode: (req: Request, res: Response, next: NextFunction) => void;
  readNode: (req: Request, res: Response, next: NextFunction) => void;
}

const dbController: DBCInterface = {
  getAllPreviews(req: Request, res: Response, next: NextFunction): void {

    // const selectSQL = 'SELECT DISTINCT job.position, job.company, interview.type, comment.title, job.id AS job_id, interview.id AS interview_id, comment.id AS comment_id FROM job JOIN interview ON job.id = interview.job_id JOIN comment ON job.id = comment.job_id';
    const selectSQL = 'SELECT job.id AS job_id, job.company, job.position FROM job UNION ALL SELECT interview.id as interview_id, interview.type, "DUMMY" FROM interview UNION ALL SELECT comment.id as comment_id, comment.title, "DUMMY" FROM comment';

    trackrDB.all(selectSQL, (err: Error, rows: []) => {
      if (err) {
        console.log(err);
        throw (err);
      }
      console.log(rows); 
      res.locals.rows = rows;
      return next();
    });
  },
  
  createNode(req: Request, res: Response, next: NextFunction): void {
    try {
      const table = req.path.slice(1);
      let buffer: number;
      if (table === 'job') buffer = 1000;
      else if (table === 'interview') {
        buffer = 2000;
        req.body.job_id = req.body.job_id - 1000;
      }
      else if (table === 'comment') {
        buffer = 3000;
        if (req.body.job_id !== undefined) req.body.job_id = req.body.job_id - 1000;
        if (req.body.interview_id !== undefined) req.body.interview_id = req.body.interview_id - 2000;
      }

      let columns = '(';
      let values = '(';

      for (const [key, value] of Object.entries(req.body)) {
        columns += `${key}, `;
        if (typeof value === 'string') {
          values += `"${value}", `;
        } else /* if (typeof value === 'number') */ {
          values += `${value}, `;
        } /* else if (value instanceof Date) {
          values
        } */
        console.log(columns)
      }

      if (columns.length <= 2 || values.length <= 2) {
        console.log('Req.body Keys: ', columns);
        console.log('Req.body values: ', values);
        throw new Error('There was an issue with the request body');
      }

      columns = columns.slice(0, columns.length - 2);
      values = values.slice(0, values.length - 2);
      columns += ')';
      values += ')';

      const createSQL = `INSERT INTO ${table} ${columns} VALUES ${values};`;

      trackrDB.run(createSQL, function callback(this, err: Error) {
        if (err) {
          console.log(err);
          throw (err);
        }
        console.log('Query successful!', this.lastID);
        res.locals.id = this.lastID + buffer;
        return next();
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },

  deleteNode(req: Request, res: Response, next: NextFunction): void {
    trackrDB.run('', (err) => {
      if (err) {
        console.log(err);
        throw (err);
      }
    });
  },

  readNode(req: Request, res: Response, next: NextFunction): void {
    trackrDB.all('', (err) => {
      if (err) {
        console.log(err);
        throw (err);
      }
    });
  },
};

export default dbController;