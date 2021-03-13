import { Request, Response } from 'express';
import { Month } from '../models/Month.class';
import { Products } from '../models/Products.enum';
import { WorkDay } from '../models/WorkDay.model';
import { ProstgresDB } from '../services/postgresDB.service';

const db = new ProstgresDB();

// const data = require('../models/data');
// let n = data.n;
// let t = data.t;

module.exports.addNewMonth = async (req: Request, res: Response) => {
	try {
		const { product, plan, days, ppr } = req.body;

		const result = await db.addNewMonth(product, days, plan, ppr);

		res.status(201).json(result);

	} catch (e) {
		console.log(e.message);
		res.status(404).json(new Error(e.message));
	}
}

module.exports.getMonth = async (req: Request, res: Response) => {
	try {
		const product = req.params.product as Products;
		const result = await db.getAllDataByProduct(product);

		const { plan, days, ppr } = result.rows[0];
		const m = new Month(product, plan, days, ppr);

		result.rows.forEach((day: WorkDay, i: number) => m.workDays.push({ day: i, amount: day.amount }));

		res.status(200).json(m);

	} catch (e) {
		console.log(e.message);
		res.status(404).json(new Error(e.message));
	}
}

module.exports.updateDay = async (req: Request, res: Response) => {
	try {
		const { product, day, amount } = req.body;

		const result = await db.setWorkDay(product, day, amount);

		res.status(201).json(result);

	} catch (e) {
		console.log(e.message);
		res.status(304).json(new Error(e.message));
	}
}

module.exports.updatePpr = async (req: Request, res: Response) => {
	try {
		const { product, ppr } = req.body;

		const result = await db.setPpr(product, ppr);

		res.status(201).json(result);

	} catch (e) {
		console.log(e.message);
		res.status(304).json(new Error(e.message));
	}
}

module.exports.updateDays = async (req: Request, res: Response) => {
	try {
		const { product, days } = req.body.days;
		const result = await db.updateDays(product, days);

		res.status(201).json(result);
	} catch (e) {
		console.log(e.message);
		res.status(304).json(new Error(e.message));
	}
}

module.exports.updatePlan = async (req: Request, res: Response) => {
	try {
		const { product, plan } = req.body;
		const result = await db.setPlan(product, plan);

		res.status(201).json(result);

	} catch (e) {
		console.log(e.message);
		res.status(304).json(new Error(e.message));
	}
}

module.exports.addWorkDay = async (req: Request, res: Response) => {
	try {
		const { product, day, amount } = req.body;
		const result = await db.addWorkDay(product, day, amount);

		res.status(201).json(result);

	} catch (e) {
		console.log(e.message);
		res.status(304).json(new Error(e.message));
	}
}

module.exports.deleteWorkDay = async (req: Request, res: Response) => {
	try {
		const { product, day } = req.body;
		const result = await db.removeWorkDay(product, day);

		res.status(201).json(result);

	} catch (e) {
		console.log(e.message);
		res.status(304).json(new Error(e.message));
	}
}
