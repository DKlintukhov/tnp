import { WorkDay, Products } from './';

export interface WorkMonth {
	product: Products;
	days: number;
	plan: number;
	ppr: number;
	workDays: WorkDay[];
}