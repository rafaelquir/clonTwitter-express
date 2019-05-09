import express, { Router, Request, Response, NextFunction  } from 'express';
import { PostService } from '../services/PostService';
import { Post } from '../models/Post';
import passport from 'passport';

const service: PostService = new PostService();
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    service.findAll()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json(err));
})


router.post("/", (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    service.createOne(user)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
})


router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.findById(id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
})

router.put("/:id", passport.authenticate("jwt", {session: false}) , (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const updatedUser = req.body;
    service.updateOne(id, updatedUser)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
})

router.delete("/:id", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.deleteOne(id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
})
export default router;
