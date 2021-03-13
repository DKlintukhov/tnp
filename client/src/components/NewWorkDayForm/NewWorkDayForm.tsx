import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import "./NewWorkDayForm.css";

interface Props {
  confirmed: (amount: number) => void;
  canceled: () => void;
}

export const NewWorkDayForm = (props: Props) => {
  const { confirmed, canceled } = props;
  const [amount, setAmount] = useState(-1);

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e?.target.value) || 0);
  };

  const onCanceled = () => {
    canceled();
  };

  const onConfirmed = () => {
    confirmed(amount);
  };

  return (
    <>
      <DialogTitle>Новая смена</DialogTitle>
      <DialogContent className="new-work-day-form__content-container">
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
        <Button onClick={onConfirmed} color="primary" disabled={amount < 1}>
          Добавить
        </Button>
      </DialogActions>
    </>
  );
};
