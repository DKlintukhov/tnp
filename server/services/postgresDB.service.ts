import { Products } from '../models/Products.enum';
import { Pool } from 'pg';

export class ProstgresDB {
	private readonly client: Pool;

	constructor() {
		this.client = new Pool({
				connectionString: process.env.DATABASE_URL,
				ssl: { rejectUnauthorized: false }
			});

		this.connect(this.client);
	}

	async setDays(product: Products, days: number) {
		return await this.transaction(this.updateDays.bind(this, product, days));
	}

	async removeWorkDay(product: Products, day: number) {
		return await this.transaction(this.deleteWorkDay.bind(this, product, day));
	}

	async setPlan(product: Products, plan: number) {
		return await this.transaction(this.updatePlan.bind(this, product, plan));
	}

	async setPpr(product: Products, ppr: number) {
		return await this.transaction(this.updatePpr.bind(this, product, ppr));
	}	

	async setWorkDay(product: Products, day: number, amount: number) {
		return await this.transaction(this.updateWorkDay.bind(this, product, day, amount));
	}

	async addWorkDay(product: Products, day: number, amount: number) {
		return await this.transaction(this.createWorkDay.bind(this, product, day, amount));
	}

	async addNewMonth(product: Products, days: number, plan: number, ppr: number) {
		return await this.transaction(this.createNewMonth.bind(this, product, days, plan, ppr));
	}

	async getAllDataByProduct(product: Products) {
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
		}
	}

	async createMonthsTable(): Promise<any> {
		return await this.transaction(this.createMonthsTable.bind(this));
	}

	async createWorkDaysTable(): Promise<any> {
		return await this.transaction(this.createWorkDaysTable.bind(this));
	}

	async transaction(operation: Function) {
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
			// this.client.release();
		}
	}

	async updateDays(product: Products, days: number): Promise<any> {
		const query = `
		UPDATE Months
		SET days = ${days}
		WHERE product_id = '${product}';
		DELETE FROM WorkDays
		WHERE day >= days
		AND product_id = '${product}';`;
		
		const res = await this.client.query(query);
		return res;
	}

	private async deleteWorkDay(product: Products, day: number): Promise<any> {
		const query = `
		DELETE FROM WorkDays 
		WHERE product_id = '${product}'
		AND day = ${day};`;

		const res = await this.client.query(query);
		return res;
	}

	private async updatePlan(product: Products, plan: number): Promise<any> {
		const query = `
		UPDATE Months
		SET plan = ${plan}
		WHERE product_id = '${product}'`;

		const res = await this.client.query(query);
		return res;
	}

	private async updatePpr(product: Products, ppr: number): Promise<any> {
		const query = `
		UPDATE Months
		SET ppr = ${ppr}
		WHERE product_id = '${product}'`;

		const res = await this.client.query(query);
		return res;
	}

	private async createNewMonth(product: Products, days: number, plan: number, ppr: number): Promise<any> {
		const query = `
		INSERT INTO Months 
		VALUES('${product}', ${days}, ${plan}, ${ppr})
		ON CONFLICT (product_id) DO UPDATE 
		SET days = ${days}, 
		plan = ${plan},
		ppr = ${ppr};
		DELETE FROM WorkDays
		WHERE product_id = '${product}';`;

		const res = await this.client.query(query);
		return res;
	}

	private async createWorkDay(product: Products, day: number, amount: number): Promise<any> {
		const query = `
		INSERT INTO WorkDays
		VALUES('${product}', ${day}, ${amount})`;

		const res = await this.client.query(query);
		return res;
	}

	private async updateWorkDay(product: Products, day: number, amount: number) {
		const query = `
		UPDATE WorkDays 
		SET amount = ${amount}
		WHERE product_id = '${product}' AND day = ${day};`

		const res = await this.client.query(query);
		return res;
	}

	private async connect(pool: Pool): Promise<void> {
		try {		
			await pool.connect();
			pool.on('connect', () => console.log('PostgreDB connected'));

		} catch(e) {
			console.log(e.message);
		}
	}

	// private async createMonthsTable(): Promise<any> {
	// 	const query = `
	// 	DROP TABLE IF EXISTS WorkDays;
	// 	DROP TABLE IF EXISTS Months;
	// 	CREATE TABLE Months(
	// 	product_id VARCHAR(64) PRIMARY KEY,
	// 	days       INTEGER NOT NULL CHECK(days >= 0),
	// 	plan       INTEGER NOT NULL CHECK(plan >= 0),
	// 	ppr        INTEGER NOT NULL CHECK(ppr >= 0));`;

	// 	const res = await this.client.query(query);
	// 	return res;
	// }

	// private async createWorkDaysTable(): Promise<any> {
	// 	const query = `
	// 	CREATE TABLE WorkDays(
	// 	product_id  VARCHAR(64) NOT NULL REFERENCES Months(product_id),
	// 	day         INTEGER NOT NULL CHECK(day >= 0),
	// 	amount      INTEGER NOT NULL CHECK(amount >= 0));`

	// 	const res = await this.client.query(query);
	// 	return res;
	// }

	private async initData(): Promise<void> {
		await this.createMonthsTable();
		await this.createWorkDaysTable();
		await this.addNewMonth(Products.Napkins, 20, 50000, 0);
		await this.addNewMonth(Products.Toilets, 20, 510000, 0);
		await this.addWorkDay(Products.Toilets, 1, 24000);
		await this.addWorkDay(Products.Toilets, 2, 22000);
		await this.addWorkDay(Products.Napkins, 1, 2400);
		await this.addWorkDay(Products.Napkins, 2, 2200);
	}
}

