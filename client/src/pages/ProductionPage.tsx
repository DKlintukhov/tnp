import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { 
  ErrorBoundary, 
  NewMonthForm, 
  NewWorkDayForm,
  SimpleForm,
  ChangeWorkDayForm,
  ProductionTable
} from '../components';
import { 
  Button, 
  CircularProgress, 
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog
} from '@material-ui/core/';

import { DBServiceContext } from '../App';
import { WorkMonth, WorkDay } from '../models';
import './ProductionPage.css';


export const ProductionPage = () => {
  const {product} = useParams();
  const dbService = useContext(DBServiceContext);

  const [month, setMonth] = useState({
    product,
    days: 0,
    plan: 0,
    ppr: 0,
    workDays: []
  } as WorkMonth);
  const [isLoading, setIsLoading] = useState(true);
  const [menuIsOpened, setMenuIsOpened] = useState(false);
  const [newMonthMenuOpened, setNewMonthMenuOpened] = useState(false);
  const [newWorkDayMenuOpened, setNewWorkDayMenuOpened] = useState(false);
  const [changePlanMenuOpened, setChangePlanMenuOpened] = useState(false);
  const [changeDaysMenuOpened, setChangeDaysMenuOpened] = useState(false);
  const [changePprMenuOpened, setShangePprMenuOpened] = useState(false);
  const [changeWorkDayMenuOpened, setShangeWorkDayMenuOpened] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const m = await dbService.getMonth(product);
        setMonth(m);
      } catch(e) {
        console.log(e.message)
      } finally {
        setIsLoading(false);
      }
    })();
  }, [product, dbService]);

  const onMenuToggle = () => {
    setMenuIsOpened(!isLoading);
  }

  const onCloseMenu = () => {
    setMenuIsOpened(false);
  }


  const onNewMonthClick = () => {
    setNewMonthMenuOpened(true);
    setMenuIsOpened(false);
  }
  const onNewMonthConfirmed = (m: WorkMonth) => {
    (async () => {
      try {
        setIsLoading(true);
        await dbService.addNewMonth(product, m.plan, m.days, m.ppr);
        setMonth(m);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
        closeNewMonthMenu();
      }
    })();
  }
  const onNewMonthCanceled = () => {
    closeNewMonthMenu();
  }
  const closeNewMonthMenu = () => {
    setNewMonthMenuOpened(false);
  }


  const onNewWorkDayClick = () => {
    setNewWorkDayMenuOpened(true);
    setMenuIsOpened(false);
  }
  const closeNewWorkDayMenu = () => {
    setNewWorkDayMenuOpened(false);
  }
  const onNewWorkDayCanceled = () => {
    setNewWorkDayMenuOpened(false);
  }
  const onNewWorkDayConfirmed = (amount: number) => {
    (async () => {
      try {
        setIsLoading(true);
        const newMonth = {...month};
        const day = newMonth.workDays.length;

        if (day > month.days) {
          throw new Error('Превышено установленное количество смен!')
        }

        newMonth.workDays.push({day, amount});
        await dbService.addWorkDay(product, day, amount);
        setMonth(newMonth);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
        setNewWorkDayMenuOpened(false);
      }
    })();
  }


  const onChangePlanClick = () => {
    setChangePlanMenuOpened(true);
    setMenuIsOpened(false);
  }
  const closeChangePlanForm = () => {
    setChangePlanMenuOpened(false);
  }
  const onChangePlanConfirmed = (plan: number) => {
    (async () => {
      try {
        setIsLoading(true);
        const newMonth = {...month};
        newMonth.plan = plan;
        await dbService.updatePlan(product, plan);
        setMonth(newMonth);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
        setChangePlanMenuOpened(false);
      }
    })();
  }
  const onChangePlanCanceled = () => {
    setChangePlanMenuOpened(false);
  }


  const onChangePprClick = () => {
    setMenuIsOpened(false);
    setShangePprMenuOpened(true);
  }
  const closeChangePprForm = () => {
    setShangePprMenuOpened(false);
  }
  const onChangePprCanceled = () => {
    setShangePprMenuOpened(false);
  }
  const onChangePprConfirmed = (ppr: number) => {
    (async () => {
      try {
        setIsLoading(true);
        const newMonth = {...month};
        newMonth.ppr = ppr;
        await dbService.updatePpr(product, ppr);
        setMonth(newMonth);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
        setShangePprMenuOpened(false);
      }
    })();
  }


  const onChangeWorkkDayClick = () => {
    setMenuIsOpened(false);
    setShangeWorkDayMenuOpened(true);
  }
  const closeChangeWorkDayMenu = () => {
    setShangeWorkDayMenuOpened(false);
  }
  const onChangeWorkDayCanceled = () => {
    setShangeWorkDayMenuOpened(false);
  }
  const onChangeWorkDayConfirmed = (workDay: WorkDay) => {
    (async () => {
      try {
        setIsLoading(true);
        const newMonth = {...month};
        newMonth.workDays[workDay.day] = workDay;
        console.log(workDay)
        await dbService.updateDay(product, workDay.day, workDay.amount);
        setMonth(newMonth);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
        setShangeWorkDayMenuOpened(false);
      }
    })();
  }

  const onChangeDaysClick = () => {
    setMenuIsOpened(false);
    setChangeDaysMenuOpened(true);
  }
  const closeChangeDaysMenuOpened = () => {
    setChangeDaysMenuOpened(false);
  }
  const onChangeDaysCanceled = () => {
    setChangeDaysMenuOpened(false);
  }
  const onChangeDaysConfirmed = (days: number) => {
    (async () => {
      try {
        setIsLoading(true);
        const newMonth = {...month};
        newMonth.days = days;
        newMonth.workDays.length = days;
        await dbService.updateDays(product, days);
        setMonth(newMonth);
      } catch(e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
        setChangeDaysMenuOpened(false);
      }
    })();
  }

  if (isLoading) {
    return (
      <div className="production-page__spinner-container">
        <CircularProgress size={"12rem"} />
      </div> 
    )
  }

  return (
    <ErrorBoundary>

      <section className="production-page__container">
         <nav className="production-page__nav-container">
          <Link className="production-page__link" to="/">
            <Button variant="outlined" color="secondary">
              Назад 
            </Button>
          </Link>
          <Button variant="outlined" color="primary" onClick={onMenuToggle}>
            Журнал
          </Button>
        </nav>
        
        <section className="production-page__table-container">
          <ProductionTable month={month} />
        </section>
        

        <SwipeableDrawer
          anchor={'bottom'}
          open={menuIsOpened}
          onClose={onCloseMenu}
          onOpen={onMenuToggle}
          >
          <List aria-label="menu">
            <ListItem button onClick={onNewMonthClick}>
              <ListItemText className="production-page__item-text" inset primary="Новый месяц" />
            </ListItem>

            <Divider />

            <ListItem button onClick={onNewWorkDayClick}>
              <ListItemText className="production-page__item-text" inset primary="Новая смена" />
            </ListItem>

            <Divider />

            <ListItem button onClick={onChangeWorkkDayClick}>
              <ListItemText className="production-page__item-text" inset primary="Изменить смену" />
            </ListItem>

            <Divider />

            <ListItem button onClick={onChangePlanClick}>
              <ListItemText className="production-page__item-text" inset primary="Изменить план" />
            </ListItem>

            <Divider />

            <ListItem button onClick={onChangeDaysClick}>
              <ListItemText className="production-page__item-text" inset primary="Изменить количество смен" />
            </ListItem>

            <Divider />

            <ListItem button onClick={onChangePprClick}>
              <ListItemText className="production-page__item-text" inset primary="Изменить часы ППР" />
            </ListItem>
          </List>
        </SwipeableDrawer>

        <Dialog open={newMonthMenuOpened} onClose={closeNewMonthMenu}>
          <NewMonthForm confirmed={onNewMonthConfirmed} canceled={onNewMonthCanceled} product={product} />
        </Dialog>

        <Divider />

        <Dialog open={newWorkDayMenuOpened} onClose={closeNewWorkDayMenu}>
          <NewWorkDayForm confirmed={onNewWorkDayConfirmed} canceled={onNewWorkDayCanceled}  />
        </Dialog>

        
        <Dialog open={changePlanMenuOpened} onClose={closeChangePlanForm}>
          <SimpleForm 
          confirmed={onChangePlanConfirmed} 
          canceled={onChangePlanCanceled}
          title={"План"}
          cancelBtnText={"Отмена"}
          confirmBtnText={"Изменить"}
          label={"Количество"}
          defaultVal={month.plan}/>
        </Dialog>

        <Dialog open={changePprMenuOpened} onClose={closeChangePprForm}>
          <SimpleForm 
          confirmed={onChangePprConfirmed} 
          canceled={onChangePprCanceled}
          title={"Часы ППР"}
          cancelBtnText={"Отмена"}
          confirmBtnText={"Изменить"}
          label={"Часы"}
          defaultVal={month.ppr}/>
        </Dialog>

        <Dialog open={changeWorkDayMenuOpened} onClose={closeChangeWorkDayMenu}>
          <ChangeWorkDayForm 
            confirmed={onChangeWorkDayConfirmed} 
            canceled={onChangeWorkDayCanceled} 
            workDays={month.workDays} />
        </Dialog>

        <Dialog open={changeDaysMenuOpened} onClose={closeChangeDaysMenuOpened}>
          <SimpleForm 
          confirmed={onChangeDaysConfirmed} 
          canceled={onChangeDaysCanceled}
          title={"Смены"}
          cancelBtnText={"Отмена"}
          confirmBtnText={"Изменить"}
          label={"Количество смен"}
          defaultVal={month.days}/>
        </Dialog>
      </section>

    </ErrorBoundary>
    );
}
