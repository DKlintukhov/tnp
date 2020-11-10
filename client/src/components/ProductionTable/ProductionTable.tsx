import React from 'react';

import { WorkMonth, Products } from '../../models';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter  from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';

import './ProductionTable.css';

const getKForToilets = (avg: number) => {
  if (avg > 22700 && avg < 26000) {
    return 1.1;
  }

  if (avg > 26000 && avg < 27000) {
    return 1.2;
  }

  if (avg > 27000) {
    return 1.25;
  }

  return 1.0;
}

const getKForNapkins = (avg: number) => {
  if (avg > 2100 && avg < 2401) {
    return 1.1;
  }
  if (avg > 2400 && avg < 2501) {
    return 1.2;
  }

  if (avg > 2500) {
    return 1.25;
  }

  return 1.0;
}

interface Props {
	month: WorkMonth;
}

export const ProductionTable = (props: Props) => {
	const {month} = props;

	const getRemainTodo = () => {
	    const res = month.plan - month.workDays.reduce((acc, d) => acc + d.amount, 0);
	    return res > 0 ? res : 0;
	}

	const getAvg = () => {
	    let res = month.workDays.reduce((acc, d) => acc + d.amount, 0);
	    res = Math.round(res / (month.workDays.length || 1));
	    return res;
	}

	const getAvgWithPpr = () => {
	    return Math.round(month.workDays.reduce((acc, d) => acc + d.amount, 0) / ((month.workDays.length - month.ppr / 10) || 1));
	}

	const getK = () => {
	    const avg = Math.round(month.workDays.reduce((acc, d) => acc + d.amount, 0) || 0 / ((month.workDays.length - month.ppr / 10) || 1));
	    if (month.product === Products.napkins)
	      	return getKForNapkins(avg);

	    if (month.product === Products.toilets)
	      	return getKForToilets(avg);
	}
	
	const getNeedsTodo = () => {
		const remainTodo = getRemainTodo();
		return Math.round(remainTodo / (month.days - month.workDays.length));
	}

	return (
		<>
			<TableContainer component={Paper} className="production-table__table-container">
		      <Table stickyHeader>

		        <TableHead>
		          <TableRow>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">План</span>
		            </TableCell>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Остаток</span>
		            </TableCell>
		          </TableRow>

		          <TableRow>
		            <TableCell className="production-table__cell" align="center">{month.plan}</TableCell>
		            <TableCell className="production-table__cell" align="center">{getRemainTodo()}</TableCell>
		          </TableRow>

		          <TableRow>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Коэффициент</span>
		            </TableCell>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Среднее в смену</span>
		            </TableCell>
		          </TableRow>

		          <TableRow>
		            <TableCell className="production-table__cell" align="center">{getK()}</TableCell>
		            <TableCell className="production-table__cell" align="center">{getAvg()}</TableCell>
		          </TableRow>

		          <TableRow>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Часы ППР</span>
		            </TableCell>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Среднее с ППР</span>
		            </TableCell>
		          </TableRow>

		          <TableRow>
		            <TableCell className="production-table__cell" align="center">{month.ppr}</TableCell>
		            <TableCell className="production-table__cell" align="center">{getAvgWithPpr()}</TableCell>
		          </TableRow>

		          <TableRow>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Смена</span>
		            </TableCell>
		            <TableCell className="production-table__cell" align="center">
		            	<span className="production-table__head-cell">Количество</span>
		            </TableCell>
		          </TableRow>

		        </TableHead>

		        <TableBody>
		          {month.workDays.map((workDay) => (
		            <TableRow key={workDay.day}>
		              <TableCell className="production-table__cell" align="center">
		                {workDay.day + 1}
		              </TableCell>
		              <TableCell className="production-table__cell" align="center">
		              	{workDay.amount}
		              </TableCell>
		            </TableRow>
		          ))}
		        </TableBody>
		      </Table>
		    </TableContainer>

		    <TableContainer component={Paper} className="production-table__table-container">
		    	<Table stickyHeader>
			        <TableFooter className="production-table__footer">
			          <TableRow>
			            <TableCell className="production-table__cell production-table__footer-cell" variant="head" align="center">
			            	<span className="production-table__head-cell">Нужно делать по</span>:
			            </TableCell>
			            <TableCell className="production-table__cell production-table__footer-cell" variant="head" align="center">
			            	{getNeedsTodo()}
			            </TableCell>
			          </TableRow>
			        </TableFooter>
			    </Table>
	        </TableContainer>
	    </>
	)
}
