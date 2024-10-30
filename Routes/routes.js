import express from "express";

const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Test API is working!');
});
export default router;