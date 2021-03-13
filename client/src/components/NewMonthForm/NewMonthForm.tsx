import React, { useState } from "react";

import { WorkMonth, Products } from "../../models";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import "./NewMonthForm.css";

interface Props {
  product: Products;
  confirmed: (m: WorkMonth) => void;
  canceled: () => void;
}

export const NewMonthForm = (props: Props) => {
  const { confirmed, canceled, product } = props;
  const [plan, setPlan] = useState(-1);
  const [days, setDays] = useState(-1);

  const onCanceled = () => {
    canceled();
  };

  const onConfirmed = () => {
    confirmed({
      product,
      plan,
      days,
      ppr: 0,
      workDays: [],
    } as WorkMonth);
  };

  const onPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan(Number(e?.target.value) || 0);
  };

  const onDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(Number(e?.target.value) || 0);
  };

  const isValid = () => {
    return days > 0 && plan > 0;
  };

  return (
    <>
      <DialogTitle>Новый месяц</DialogTitle>
      <DialogContent className="new-month-form__content-container">
        <TextField
          autoFocus
          margin="dense"
          label="План"
          type="number"
          required
          fullWidth
          onChange={onPlanChange}
        />

        <TextField
          margin="dense"
          label="Количество смен"
          type="number"
          required
          fullWidth
          onChange={onDaysChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCanceled} color="primary">
          Отмена
        </Button>
        <Button onClick={onConfirmed} color="primary" disabled={!isValid()}>
          Создать
        </Button>
      </DialogActions>
    </>
  );
};
