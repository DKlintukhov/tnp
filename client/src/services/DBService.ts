import { WorkMonth, Products } from '../models';

export class DBService {
	private readonly url = '/api';
	// private readonly url = 'http://localhost:4444/api';

	public async addNewMonth(product: Products, plan: number, days: number, ppr: number) {
		const res = await fetch(`${this.url}/month/${product}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({product, plan, days, ppr})
		})

		if (!res.ok) {
			throw new Error(`Could not save` +
				`, received ${res.status}`)
		}
	}

	public async getMonth(p: Products): Promise<WorkMonth> {
		console.log('URL:', `${this.url}/month/${p}`)
		const res = await fetch(`${this.url}/month/${p}`);

		if (!res.ok) {
			throw new Error(`Could not fetch the month` +
				`, received ${res.status}`)
		}

		const result = await res.json();

		return result;
		
	}

	public async updateDay(product: Products, day: number, amount: number) {
		const res = await fetch(`${this.url}/day/${product}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({product, day, amount})
		})

		if (!res.ok) {
			throw new Error(`Could not update the day` +
				`, received ${res.status}`)
		}
	}

	public async updateDays(product: Products, days: number) {
		const res = await fetch(`${this.url}/days/${product}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({days})
		})

		if (!res.ok) {
			throw new Error(`Could not update the days` +
				`, received ${res.status}`)
		}
	}

	public async updatePlan(product: Products, plan: number) {
		const res = await fetch(`${this.url}/plan/${product}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({product, plan})
		})

		if (!res.ok) {
			throw new Error(`Could not update the plan` +
				`, received ${res.status}`)
		}
	}

	public async updatePpr(product: Products, ppr: number) {
		const res = await fetch(`${this.url}/ppr/${product}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({product, ppr})
		})

		if (!res.ok) {
			throw new Error(`Could not update the ppr` +
				`, received ${res.status}`)
		}
	}

	public async addWorkDay(product: Products, day: number, amount: number) {
		const res = await fetch(`${this.url}/day/${product}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({product, day, amount})
		})

		if (!res.ok) {
			throw new Error(`Could not update the work day` +
				`, received ${res.status}`)
		}
	}

	public async deleteWorkDay(product: Products, day: number) {
		const res = await fetch(`${this.url}/day/${product}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({product, day})
		})

		if (!res.ok) {
			throw new Error(`Could not delete the work day` +
				`, received ${res.status}`)
		}
	}
}