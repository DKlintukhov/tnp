export const dataBase = {
	url: process.env.NODE_ENV === 'production' 
																? '/api' 
																: 'http://localhost:4444/api'
}

export const mockMonthData = `{"product":"napkins","plan":50000,"days":19,"ppr":0,"workDays":[{"day":0,"amount":2520},{"day":1,"amount":2400},{"day":2,"amount":2355},{"day":3,"amount":2400},{"day":4,"amount":2400},{"day":5,"amount":2400},{"day":6,"amount":2500},{"day":7,"amount":2400},{"day":8,"amount":2480}]}`;