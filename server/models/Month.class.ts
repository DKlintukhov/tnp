import { Products } from './Products.enum';
import { WorkDay } from './WorkDay.model';

export class Month {
	constructor(
		public product: Products, 
		public plan = 0, 
		public days = 0,
		public ppr = 0, 
		public workDays: WorkDay[] = []
	) {}
}

