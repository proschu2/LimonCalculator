import * as yup from 'yup';

import {
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Collapse,
  InputAdornment,
  Link,
  List,
  ListItem,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  Field,
  FieldProps,
  Formik,
  FormikHelpers,
  getIn,
  useFormikContext,
} from 'formik';
import { Help, HelpOutline } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import parse from 'html-react-parser';
import './App.css';
// import * as _ from "lodash";

const lemonTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#028174',
    },
    secondary: { main: '#0AB68B' },
    text: {
      primary: '#028174',
    },
    background: {
      default: '',
      paper: '#92de8b',
    },
  },
});

const useStyles = makeStyles((theme) => {
  return {
    form: {
      width: '100%', // Fix IE 11 issue.
    },
    container: {
      padding: '12px',
      maxWidth: '700px',
      color: lemonTheme.palette.primary.main,
      [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(1),
      },
    },
    paper: {
      background: lemonTheme.palette.background.paper,
      padding: '12px',
      [theme.breakpoints.down('sm')]: {
        padding: '10px',
      },
    },
    table: {
      marginTop: '20px',
    },
    inputLabel: {
      color: lemonTheme.palette.text.primary,
    },
    inputAdornment: {
      fontSize: '14px',
      marginRight: '8px',
      [theme.breakpoints.down('sm')]: { marginRight: '2px' },
    },
    inputField: {
      color: lemonTheme.palette.primary.main,
      padding: '0 7px',
    },
    cardLabel: {
      fontSize: '14px',
    },
    cardRoot: {
      background: 'transparent !important',
    },
    cardValue: {
      fontSize: '16px',
    },
    cardValueWithUnit: {
      fontSize: '16px',
      display: 'table-cell',
      textAlign: 'left',
      width: '50%',
      //paddingRight: '10px',
    },
    cardUnit: {
      fontSize: '16px',
      display: 'table-cell',
      textAlign: 'right',
      width: '50%',
      //paddingLeft: '10px',
    },
    cardTable: {
      display: 'table',
      width: '100%',
      marginLeft: 'auto',
      marginRight: '0',
    },
    cardContent: {
      padding: '10px 7px !important',
    },
    cardTable2: {
      display: 'inline-table',
      textAlign: 'left',
      width: '50%',
    },
    cardTable0: {
      paddingRight: '7px',
      [theme.breakpoints.down('xs')]: {
        paddingRight: '22px',
      },
      borderRight: `1px solid ${lemonTheme.palette.secondary.dark}`,
    },
    cardTable1: {
      paddingLeft: '7px',
      [theme.breakpoints.down('xs')]: {
        paddingLeft: '21px',
      },
    },
    introTitle: {
      marginBottom: '15px',
    },
    introListItem: {},
    introStepsTitle: {
      background: 'transparent !important',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: '25px',
      '&:hover': {
        color: lemonTheme.palette.secondary.main,
      },
      padding: '0px !important',
    },
    introSubtitle: {
      paddingLeft: '10px',
      marginBottom: '15px',
    },
    gridPadding: {
      marginTop: '4px',
      marginBottom: '4px',
    },
  };
});

const Step: FC<{ text: string; key: any }> = (props) => {
  return (
    <ListItem
      style={{ fontSize: '16px', color: lemonTheme.palette.primary.main }}
      key={props.key}
      color="primary"
    >
      {parse(props.text)}
    </ListItem>
  );
};

const Input: FC<FieldProps & TextFieldProps> = (props) => {
  const isTouched = getIn(props.form.touched, props.field.name);
  const errorMessage = getIn(props.form.errors, props.field.name);
  const classes = useStyles();
  const { error, helperText, field, form, ...rest } = props;
  return (
    <TextField
      variant="outlined"
      margin="dense"
      error={error ?? Boolean(isTouched && errorMessage)}
      helperText={
        helperText ?? (isTouched && errorMessage ? errorMessage : undefined)
      }
      {...rest}
      {...field}
      InputLabelProps={{
        shrink: false,
        classes: {
          root: classes.inputLabel,
        },
      }}
      /*InputProps={{
        classes: {
          root: classes.inputField,
        },
      }}*/
    />
  );
};

interface FormValues {
  peel: number;
  gradiation: number;
  sugarPerc: number;
}

interface Calculation {
  alcohol: number;
  totalWeight: number;
}

const validationSchema = yup.object().shape({
  peel: yup.string().required('Necessario'),
  gradiation: yup
    .number()
    .min(1, 'Inserisci una percentuale')
    .max(96, 'Inserisci una percentuale'),
  sugarPerc: yup
    .number()
    .min(1, 'Inserisci una percentuale tra 1 e 60')
    .max(60, 'Inserisci una percentuale tra 1 e 60'),
});

const App = () => {
  return (
    <Formik
      initialValues={{
        peel: 300,
        gradiation: 40,
        sugarPerc: 45,
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormValues,
        formikHelpers: FormikHelpers<FormValues>,
      ) => {
        formikHelpers.setSubmitting(false);
      }}
    >
      <LemonForm />
    </Formik>
  );
};

interface IRequirementCard {
  label: string;
  value: number;
  unit: string;
}

interface IRequirementCardContent {
  label?: string;
  value: number;
  unit: string;
}

const RequirementCardContent: FC<IRequirementCardContent> = (props) => {
  const classes = useStyles();
  const { value, unit, label } = props;
  return (
    <span className={classes.cardTable}>
      {label && (
        <InputAdornment
          position="start"
          className={classes.inputAdornment}
          disableTypography={true}
        >
          {label}
        </InputAdornment>
      )}
      <Typography
        color="primary"
        className={classes.cardValueWithUnit}
        variant="h3"
      >
        {value}
      </Typography>
      <Typography className={classes.cardUnit} color="textSecondary">
        {unit}
      </Typography>
    </span>
  );
};

const RequirementCard: FC<IRequirementCard> = (props) => {
  const classes = useStyles();
  const { label, value, unit } = props;
  return (
    <Card variant="outlined" className={classes.cardRoot}>
      <CardContent className={classes.cardContent}>
        <RequirementCardContent value={value} unit={unit} label={label} />
      </CardContent>
    </Card>
  );
};

interface IRequirements {
  water: number;
  sugar: number;
  alcohol: number;
}

const LemonForm = () => {
  const { values, isValid } = useFormikContext<FormValues>();
  const [calculation, setCalculation] = useState<Calculation>();
  const [requirements, setRequirements] = useState<IRequirements>();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setTimeout(() => setOpen(!open), 200);
  };

  const updateRequirements = (calc: Calculation, sugarPerc: number) => {
    const { alcohol, totalWeight } = calc;
    const { water, sugar } = getFromSugar(totalWeight, sugarPerc);
    setRequirements({
      water,
      sugar,
      alcohol,
    });
  };
  useEffect(() => {
    let calc = calculate({ peel: values.peel, gradiation: values.gradiation });
    setCalculation(calc);
    updateRequirements(calc, values.sugarPerc);
  }, [values]);

  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={lemonTheme}>
        <Container component="main" maxWidth="sm" className={classes.container}>
          <Paper className={classes.paper}>
            <Typography
              component="h1"
              variant="h4"
              className={classes.introTitle}
              color="primary"
            >
              LimonCalculator
            </Typography>
            <Typography
              variant="subtitle1"
              color="primary"
              display="block"
              className={classes.introSubtitle}
            >
              Calcolatore per il Limoncello Scientifico di{' '}
              <Link
                href="http://bressanini-lescienze.blogautore.espresso.repubblica.it/2015/12/21/le-ricette-scientifiche-il-limoncello-anche-veloce/comment-page-2/"
                color="secondary"
              >
                Bessarini
              </Link>
              .<br />
              Idea nata da un thread di{' '}
              <Link
                href="https://www.reddit.com/r/italy/comments/ed993f/aggiornamento_del_foglio_calcolatore_per_il/?utm_source=share&utm_medium=web2x&context=3"
                color="secondary"
              >
                r/italy
              </Link>
              , più nello specifico da questo{' '}
              <Link
                href="https://www.reddit.com/r/italy/comments/ed993f/aggiornamento_del_foglio_calcolatore_per_il/fbj3mbr/?utm_source=reddit&utm_medium=web2x&context=3"
                color="secondary"
              >
                commento
              </Link>
              .
            </Typography>
            <Button
              className={classes.introStepsTitle}
              onClick={handleClick}
              color="primary"
              variant="text"
              size="large"
              disableFocusRipple={true}
              disableElevation={true}
              endIcon={
                !open ? (
                  <Help
                    fontSize="small"
                    onClick={handleClick}
                    color="inherit"
                  />
                ) : (
                  <HelpOutline
                    fontSize="small"
                    onClick={handleClick}
                    color="inherit"
                  />
                )
              }
            >
              Spiegazione
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List dense={true} style={{ padding: '0px' }}>
                {[
                  'Strofinare i limoni con una spugna pulita',
                  'Pelare i limoni con un pelapatate, rimuovendo con cura la parte bianca',
                  'Inserire il peso delle bucce e le percentuali di gradazione e zucchero desiderate nei rispettivi campi',
                ].map((v, key) => {
                  return <Step text={v} key={key}></Step>;
                })}
              </List>
            </Collapse>
            <form noValidate className={classes.form}>
              <Grid
                container
                spacing={2}
                justify="space-around"
                alignItems="center"
                className={classes.gridPadding}
              >
                <Grid item xs={4}>
                  <Field
                    name="peel"
                    fullWidth
                    id="peel"
                    component={Input}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                          disableTypography={true}
                        >
                          🍋
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                      classes: {
                        root: classes.inputField,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    fullWidth
                    id="gradiation"
                    name="gradiation"
                    component={Input}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                          disableTypography={true}
                        >
                          🍸
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      classes: {
                        root: classes.inputField,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    fullWidth
                    id="sugarPerc"
                    name="sugarPerc"
                    component={Input}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputAdornment}
                          disableTypography={true}
                          position="start"
                        >
                          🍬
                        </InputAdornment>
                      ),
                      type: 'number',
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      classes: {
                        root: classes.inputField,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </form>
            {calculation &&
              calculation.totalWeight > 0 &&
              requirements &&
              values &&
              values.peel &&
              values.gradiation &&
              values.sugarPerc &&
              isValid && (
                <>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List dense={true} style={{ padding: '0px' }}>
                      {[
                        `Mettere le bucce in macerazione al buio in ${requirements.alcohol} ml di alcol puro per un periodo che va da 1 a 3 giorni, secondo preferenza`,
                        'Agitare occasionalmente',
                      ].map((v, key) => {
                        return <Step text={v} key={key}></Step>;
                      })}
                    </List>
                  </Collapse>
                  <Grid
                    container
                    spacing={2}
                    justify="space-around"
                    alignItems="center"
                    className={classes.gridPadding}
                  >
                    <Grid item xs={4}>
                      <RequirementCard
                        label="🍸"
                        value={requirements.alcohol}
                        unit={'ml'}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <RequirementCard
                        label="💧"
                        value={requirements.water}
                        unit={'ml'}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <RequirementCard
                        label="🍬"
                        value={requirements.sugar}
                        unit={'g'}
                      />
                    </Grid>
                  </Grid>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List dense={true} style={{ padding: '0px' }}>
                      {[
                        `Una volta passato il periodo di infusione, preparare lo sciroppo di zucchero facendo scaldare ${requirements.water} ml d'acqua, unendoci ${requirements.sugar} g di zucchero e mescolando finché il liquido risulta limpido`,
                        'Togliere dal fuoco e attendere che lo sciroppo raggiunga la temperatura ambiente',
                        "Filtrare l'infusione rimuovendo tutte le bucce di 🍋",
                        "Mescolare l'infusione con lo sciroppo",
                        'Imbottigliare e gustare il preparato, meglio se si attende ancora qualche giorno prima di provarlo',
                      ].map((v, key) => {
                        return <Step text={v} key={key}></Step>;
                      })}
                    </List>
                  </Collapse>
                </>
              )}
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

const getFromSugar = (weight: number, sugarPercentage: number) => {
  const sugar = Math.round((sugarPercentage / 100) * weight);
  const water = Math.round(weight - sugar);
  return {
    sugar,
    water,
  };
};

export const calculate = (values: Partial<FormValues>): Calculation => {
  let { peel, gradiation } = values;
  if (!gradiation || !peel || gradiation === 0 || peel === 0) {
    return {
      alcohol: 0,
      totalWeight: 0,
    };
  }
  if (gradiation >= 1) {
    gradiation /= 100;
  }
  const alcoholDensity = 0.78945;
  // quantity of 💧 inside 🍋 peels
  const peelWater = 0.7 * peel;
  // for each 30g of 🍋 we need ca. 100 ml of 🍸
  const alcohol = Math.round((peel * 10) / 3);
  // 🍸 at 96% contains 4% of 💧
  const alcoholWaterMl = 0.04 * alcohol;
  // in the 🍋 + 🍸 mix, the total amount of 💧
  const totalWaterMl = alcoholWaterMl + peelWater;
  // the quantity of pure 🍸 is 96% of the 🍸 volume
  const alcoholPureMl = 0.96 * alcohol;
  // gradiation of the mix is given by the ratio of pure 🍸 over the total volume of the mix
  const mixGradiation = alcoholPureMl / (alcoholPureMl + totalWaterMl);
  // once we remove the peels, we can get the volume of 💧 remaining by removing the 🍸 part from the initial volume
  const waterAfterMl = (1 - mixGradiation) * alcohol;
  // the rest is pure 🍸
  const alcoholAfterMl = alcohol * mixGradiation;
  const alcoholAfterGr = alcoholAfterMl * alcoholDensity;
  const sugarWaterMl = alcoholAfterMl / gradiation - alcohol;
  const totalWeight = sugarWaterMl + waterAfterMl + alcoholAfterGr;
  return {
    alcohol: Math.round(alcohol),
    totalWeight: Math.round(totalWeight),
  };
};

export default App;
