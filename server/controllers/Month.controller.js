const data = require('../models/data');
const Month = require('../models/Month.class');
const db = require('../services/postgresDB.service.js').getDataBase();
let n = data.n;
let t = data.t;

module.exports.addNewMonth = async (req, res) => {
	try {
		const {product, plan, days, ppr} = req.body;

		const result = await db.addNewMonth(product, days, plan, ppr);

		res.status(201).json({
			message: `The month was seccessfully created`
		});

	} catch(e) {
		console.log(e.message);
		res.status(404).json({
			error: new Error(`The month didn't added`),
		})
	}	
}

module.exports.getMonth = async (req, res) => {
	try {
		const product = req.params.product;
		const result = await db.getAllDataByProduct(product);

		if (result.rows[0]) {
			const {plan, days, ppr} = result.rows[0];
			const m = new Month(product, plan, days, ppr);

			result.rows.forEach((day, i) => {
				m.workDays.push({day: i, amount: day.amount});
			})

			res.status(200).json(m);
		} else {
			res.status(200).json({});
		}

	} catch(e) {
		console.log(e.message);
		res.status(404).json({
			error: new Error(`The month doesn't exist`),
		})
	}
}

module.exports.updateDay = async (req, res) => {
	try {
		const {product, day, amount} = req.body;

		const result = await db.updateWorkDay(product, day, amount);

		res.status(201).json({
			message: 'The day was successfully updated'
		});

	} catch(e) {
		console.log(e.message);
		res.status(304).json({
			error: new Error(`Can't update the day`),
		})
	}
}

module.exports.updatePpr = async (req, res) => {
	try {
		const {product, ppr} = req.body;

		const result = await db.updatePpr(product, ppr);

		res.status(201).json({
			message: 'The ppr was successfully updated'
		});

	} catch(e) {
		console.log(e.message);
		res.status(304).json({
			error: new Error(`Can't update the ppr`),
		})
	}	
}

module.exports.updateDays = async (req, res) => {
	try {
		const {product, days} = req.body.days;
		const result = await db.updateDays(product, ppr);

		res.status(201).json({
			message: 'The days were successfully updated'
		});
	} catch(e) {
		console.log(e.message);
		res.status(304).json({
			error: new Error(`Can't update the days`),
		})
	}	
}

module.exports.updatePlan = async (req, res) => {
	try {
		const {product, plan} = req.body;
		const result  = await db.updatePlan(product, plan);

		res.status(201).json({
			message: 'The plan was successfully updated'
		});

	} catch(e) {
		console.log(e.message);
		res.status(304).json({
			error: new Error(`Can't update work plan`),
		})
	}	
}

module.exports.addWorkDay = async (req, res) => {
	try {
		const {product, day, amount} = req.body;
		const result  = await db.addWorkDay(product, day, amount);

		res.status(201).json({
			message: 'Work day was successfully added'
		});

	} catch(e) {
		console.log(e.message);
		res.status(304).json({
			error: new Error(`Can't add work work day`),
		})
	}	
}

module.exports.deleteWorkDay = async (req, res) => {
	try {
		const {product, day} = req.body;
		const result  = await db.deleteWorkDay(product, day);

		res.status(201).json({
			message: 'The work day was successfully deleted'
		});

	} catch(e) {
		console.log(e.message);
		res.status(304).json({
			error: new Error(`Can't delete work day`),
		})
	}	
}