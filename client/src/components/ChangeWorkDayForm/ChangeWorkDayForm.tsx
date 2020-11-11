import React, { useState } from 'react';

import { WorkDay } from '../../models';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './ChangeWorkDayForm.css';

interface Props {
	confirmed: (day: WorkDay) => void;
	canceled: () => void;
	workDays: WorkDay[];
}


export const ChangeWorkDayForm = (props: Props) => {
	const {confirmed, canceled, workDays} = props;
	const [day, setWorkDay] = useState({day: 0, amount: 0});
	const [selectedDay, setSelectedDay] = useState(0);

	const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWorkDay({
			day: selectedDay,
			amount: Number(e?.target.value) || 0
		});
	}

	const onCanceled = () => {
		canceled();
	}

	const onConfirmed = () => {
		confirmed(day);
	}

	const onDaySelected = (day: number) => {
		setSelectedDay(day);
	}


	return (
		<>
			<DialogTitle>Изменить смену</DialogTitle>
	        <DialogContent className="change-work-day-form__content-container">
		        <List className="change-work-day-form__list">
	              {workDays.length > 0 
	              	? 	workDays.map((workDay) => {
			              	return (
			              		<ListItem button key={workDay.day} selected={selectedDay === workDay.day} onClick={() => onDaySelected(workDay.day)}> 
			              			<ListItemText primary={workDay.day + 1} /> <ListItemText primary={workDay.amount} />
			              		</ListItem>
			              	)
	              		})
	              	: <ListItemText inset primary="Нет смен" />}
	            </List>

	          <TextField
	          	autoFocus
	            margin="dense"
	            label="Количество"
	            type="number"
	            required
	            fullWidth
	            onChange={onAmountChange}
	          />
	        </DialogContent>
	        <DialogActions>
	          <Button onClick={onCanceled} color="primary">
	            Отмена
	          </Button>
	          <Button onClick={onConfirmed} color="primary" disabled={day.amount < 1}>
	            Изменить
	          </Button>
	        </DialogActions>
		</>
	)
}