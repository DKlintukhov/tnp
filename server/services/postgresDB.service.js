const { Pool } = require('pg');

class ProstgresDB {
	constructor() {
		this.client = null;
		this._createDB_();
	}

	async updateDays(product, days) {
		return this._transaction_(this._updateDays_.bind(this, product, day))
	}

	async deleteWorkDay(product, day) {
		return this._transaction_(this._deleteWorkDay_.bind(this, product, day));
	}

	async updatePlan(product, plan) {
		return this._transaction_(this._updatePlan_.bind(this, product, plan));
	}

	async updatePpr(product, ppr) {
		return this._transaction_(this._updatePpr_.bind(this, product, ppr));
	}	

	async updateWorkDay(product, day, amount) {
		return await this._transaction_(this._updateWorkDay_.bind(this, product, day, amount));
	}

	async addWorkDay(product, day, amount) {
		return await this._transaction_(this._addWorkDay_.bind(this, product, day, amount));
	}

	async addNewMonth(product, days, plan, ppr) {
		return await this._transaction_(this._addNewMonth_.bind(this, product, days, plan, ppr));
	}

	async getAllDataByProduct(product) {
		// this.client.connect();
		// this.client.on('connect', () => console.log('DB is connected'));

		try {
			const query = `
			SELECT day, amount, plan, ppr, days
			FROM WorkDays 
			INNER JOIN Months 
			ON (Months.product_id = '${product}' 
			AND WorkDays.product_id = '${product}')
			ORDER BY day;`

			return await this.client.query(query);
		} catch(err) {
			console.log(err.message);
			throw new Error(err.message);
		} finally {
			//this.client.release();
		}
	}

	async createMonthsTable() {
		return await this._transaction_(this._createMonthsTable_.bind(this));
	}

	async createWorkDaysTable() {
		return await this._transaction_(this._createWorkDaysTable_.bind(this));
	}

	async _transaction_(operation) {
		// this.client.connect();
		// this.client.on('connect', () => console.log('DB is connected'));

		try {
			await this.client.query('BEGIN');

			const result = await operation();

			await this.client.query('COMMIT');

			return result;
		} catch(err) {
			await this.client.query('ROLLBACK');
			console.log(err.message);
			throw new Error(err.message);
		} finally {
			//this.client.release();
		}
	}

	async updateDays(product, days) {
		const query = `
		UPDATE Months
		SET days = ${days}
		WHERE product_id = '${product}';
		DELETE FROM WorkDays
		WHERE day >= days
		AND product_id = '${product}';`;
		
		return await this.client.query(query);
	}

	async _deleteWorkDay_(product, day) {
		const query = `
		DELETE FROM WorkDays 
		WHERE product_id = '${product}'
		AND day = ${day};`;

		return await this.client.query(query);
	}

	async _updatePlan_(product, plan) {
		const query = `
		UPDATE Months
		SET plan = ${plan}
		WHERE product_id = '${product}'`;

		return await this.client.query(query);
	}

	async _updatePpr_(product, ppr) {
		const query = `
		UPDATE Months
		SET ppr = ${ppr}
		WHERE product_id = '${product}'`;

		return await this.client.query(query);
	}

	async _addNewMonth_(product, days, plan, ppr) {
		const query = `
		INSERT INTO Months 
		VALUES('${product}', ${days}, ${plan}, ${ppr})
		ON CONFLICT (product_id) DO UPDATE 
		SET days = ${days}, 
		plan = ${plan},
		ppr = ${ppr};
		DELETE FROM WorkDays
		WHERE product_id = '${product}';`;

		return await this.client.query(query);
	}

	async _addWorkDay_(product, day, amount) {
		const query = `
		INSERT INTO WorkDays
		VALUES('${product}', ${day}, ${amount})`;

		return await this.client.query(query);
	}

	async _createMonthsTable_() {
		const query = `
		DROP TABLE IF EXISTS WorkDays;
		DROP TABLE IF EXISTS Months;
		CREATE TABLE Months(
		product_id VARCHAR(64) PRIMARY KEY,
		days       INTEGER NOT NULL CHECK(days >= 0),
		plan       INTEGER NOT NULL CHECK(plan >= 0),
		ppr        INTEGER NOT NULL CHECK(ppr >= 0));`;

		return await this.client.query(query);
	}

	async _createWorkDaysTable_() {
		const query = `
		CREATE TABLE WorkDays(
		product_id  VARCHAR(64) NOT NULL REFERENCES Months(product_id),
		day         INTEGER NOT NULL CHECK(day >= 0),
		amount      INTEGER NOT NULL CHECK(amount >= 0));`

		return await this.client.query(query);
	}

	async _updateWorkDay_(product, day, amount) {
		const query = `
		UPDATE WorkDays 
		SET amount = ${amount}
		WHERE product_id = '${product}' AND day = ${day};`

		return await this.client.query(query);
	}


	async _createDB_() {
		this.client = new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false
			}
		});

		await this.client.connect();
		this.client.on('connect', () => console.log('PostgreDB is connected'));
		//await this._initData_();
	}

	async _initData_() {
		await this.createMonthsTable();
		await this.createWorkDaysTable();
		await this.addNewMonth('napkins', 20, 50000, 0);
		await this.addNewMonth('toilets', 20, 510000, 0);
		await this.addWorkDay('toilets', 1, 24000);
		await this.addWorkDay('toilets', 2, 22000);
		await this.addWorkDay('napkins', 1, 2400);
		await this.addWorkDay('napkins', 2, 2200);
	}
}

module.exports.getDataBase = () => new ProstgresDB();
