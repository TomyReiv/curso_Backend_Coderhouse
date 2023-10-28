import { Router } from "express";

const router = Router();

router.get('/realTimeProducts', (req, res) =>{
    res.render('index', {title: 'Demo'});
});

router.get('/login', (req, res) =>{
    res.render('login');
});
export default router;