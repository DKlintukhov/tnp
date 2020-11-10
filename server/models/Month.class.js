module.exports = class Month {
	constructor(product, plan = 0, days = 0, ppr = 0){
		this.product = product;
		this.plan = plan;
		this.days = days;
		this.ppr = ppr;
		this.workDays = [];
	}
}
