import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import './SimpleForm.css';

interface Props {
	confirmed: (val: number) => void;
	canceled: () => void;
	title: string;
	cancelBtnText: string;
	confirmBtnText: string;
	label: string;
	defaultVal: number;
}

export const SimpleForm = (props: Props) => {
	const {confirmed, canceled, title, cancelBtnText, confirmBtnText, label, defaultVal} = props;
	const [value, setValue] = useState(-1);

	const onValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(Number(e?.target.value) || 0);
	}

	const onCanceled = () => {
		canceled();
	}

	const onConfirmed = () => {
		confirmed(value);
	}

	return (
		<>
			<DialogTitle>{title}</DialogTitle>
	        <DialogContent className="simple-form__content-container">

	          <TextField
	            margin="dense"
	            label={label}
	            type="number"
	            required
	            fullWidth
	            defaultValue={defaultVal}
	            onChange={onValChange}
	          />
	        </DialogContent>
	        <DialogActions>
	          <Button onClick={onCanceled} color="primary">
	            {cancelBtnText}
	          </Button>
	          <Button onClick={onConfirmed} color="primary" disabled={value < 0}>
	            {confirmBtnText}
	          </Button>
	        </DialogActions>
		</>
	)
}