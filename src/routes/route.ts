import express from 'express';
import {ticketController} from '../controller/ticketController';

export const router = express.Router();

router.get('/boleto/', ticketController);