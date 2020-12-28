import './App.css';

import * as yup from 'yup';

import {
    Card,
    CardContent,
    Container,
    CssBaseline,
    Grid,
    InputAdornment,
    Link,
    List,
    ListItem,
    Typography
} from '@material-ui/core';
import { Field, FieldProps, Formik, FormikHelpers, getIn, useFormikContext } from 'formik';
import { Help, HelpOutline } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import parse from 'html-react-parser';

// import * as _ from "lodash";

const theme = createMuiTheme({
  palette: {
    primary: { main: '#1a237e' },
    text: {
      primary: '#1a237e',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  container: {
    padding: '24px',
    maxWidth: '700px',
    color: '#1a237e',
    [theme.breakpoints.up('sm')]: {
      marginTop: '50px',
    },
  },
  table: {
    marginTop: '20px',
  },
  inputLabel: {
    color: theme.palette.primary.main,
  },
  cardLabel: {
    fontSize: '14px',
  },
  cardRoot: {
    background: 'transparent !important',
    padding: '-2px -2px 0px',
  },
  cardValue: {
    fontSize: '18px',
  },
  cardValueWithUnit: {
    fontSize: '18px',
    display: 'table-cell',
    textAlign: 'left',
    width: '50%',
    paddingRight: '10px',
  },
  cardUnit: {
    fontSize: '16px',
    display: 'table-cell',
    textAlign: 'right',
    width: '50%',
    paddingLeft: '10px',
  },
  cardTable: {
    display: 'table',
    width: '100%',
  },
  cardTable2: {
    display: 'inline-table',
    textAlign: 'left',
    width: '50%',
  },
  cardTable0: {
    paddingRight: '7px',
    borderRight: `1.5px solid ${theme.palette.info.dark}`,
  },
  cardTable1: {
    paddingLeft: '7px',
  },
  link: {
    color: theme.palette.info.dark,
  },
  introTitle: {
    marginBottom: '15px',
    color: theme.palette.primary.dark,
  },
  introListItem: {},
  introStepsTitle: {
    marginBottom: '15px',
    marginTop: '15px',
    background: 'transparent !important',
    color: theme.palette.primary.dark,
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    '&:hover': {
      color: theme.palette.info.dark,
    },
  },
  intoHelpIcon: {
    '&:hover': {
      color: theme.palette.info.dark,
    },
  },
  introSubtitle: {
    paddingLeft: '10px',
    marginBottom: '15px',
  },
  gridPadding: {
    marginTop: '10px',
    marginBottom: '10px',
  },
}));

const Step: FC<{ text: string }> = (props) => {
  return <ListItem style={{ fontSize: '16px' }}>{parse(props.text)}</ListItem>;
};

const Input: FC<FieldProps & TextFieldProps> = (props) => {
  const isTouched = getIn(props.form.touched, props.field.name);
  const errorMessage = getIn(props.form.errors, props.field.name);
  const classes = useStyles();
  const { error, helperText, field, form, ...rest } = props;
  return (
    <TextField
      variant="outlined"
      error={error ?? Boolean(isTouched && errorMessage)}
      helperText={
        helperText ?? (isTouched && errorMessage ? errorMessage : undefined)
      }
      {...rest}
      {...field}
      InputLabelProps={{
        classes: {
          root: classes.inputLabel,
        },
      }}
    />
  );
};

interface FormValues {
  peel: number;
  gradiation: number;
  sugarPerc: number;
}

interface Calculation {
  alcol: number;
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
  const onSubmit = (values: FormValues) => {};
  return (
    <Formik
      initialValues={{
        peel: 120,
        gradiation: 35,
        sugarPerc: 23,
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormValues,
        formikHelpers: FormikHelpers<FormValues>,
      ) => {
        onSubmit(values);
        formikHelpers.setSubmitting(false);
      }}
    >
      <LemonForm />
    </Formik>
  );
};

interface IRequirementCard {
  label: string;
  value: number[];
  unit?: string[];
}

interface IRequirementCardContent {
  value: number;
  unit: string;
}

const RequirementCardContent: FC<IRequirementCardContent> = (props) => {
  const classes = useStyles();
  const { value, unit } = props;
  return (
    <div className={classes.cardTable}>
      <Typography className={classes.cardValueWithUnit} variant="h3">
        {value}
      </Typography>
      <Typography
        className={classes.cardUnit}
        classes={{
          root:
            'MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary',
        }}
      >
        {unit}
      </Typography>
    </div>
  );
};

const RequirementCard: FC<IRequirementCard> = (props) => {
  const classes = useStyles();
  const { label, value, unit } = props;
  return (
    <Card variant="outlined" className={classes.cardRoot}>
      <CardContent>
        {label && (
          <Typography
            className={classes.cardLabel}
            variant="subtitle1"
            gutterBottom
          >
            {label}
          </Typography>
        )}
        {value.length === 1 && unit ? (
          <RequirementCardContent value={value[0]} unit={unit[0]} />
        ) : value.length === 2 && unit ? (
          value.map((v, key) => (
            <div
              className={clsx(
                classes.cardTable2,
                key === 0 ? classes.cardTable0 : classes.cardTable1,
              )}
            >
              <RequirementCardContent value={v} unit={unit[key]} />
            </div>
          ))
        ) : (
          value && (
            <Typography className={classes.cardValue} variant="h3">
              {value}
            </Typography>
          )
        )}
      </CardContent>
    </Card>
  );
};

interface IRequirements {
  water: number;
  sugar: number;
  alcol: number;
}

const LemonForm = () => {
  const { values, handleChange, isValid } = useFormikContext<FormValues>();
  const [calculation, setCalculation] = useState<Calculation>();
  const [requirements, setRequirements] = useState<IRequirements>();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const updateRequirements = (calc: Calculation, sugarPerc: number) => {
    const { alcol, totalWeight } = calc;
    const { water, sugar } = getFromSugar(totalWeight, sugarPerc);
    setRequirements({
      water,
      sugar,
      alcol,
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
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" className={classes.container}>
          <CssBaseline />
          <Typography
            component="h1"
            variant="h4"
            className={classes.introTitle}
          >
            LimonCalculator
          </Typography>
          <Typography
            variant="subtitle1"
            color="primary"
            display="block"
            className={classes.introSubtitle}
          >
            Calcolatore per il Limoncello/ino Scientifico di{' '}
            <Link
              href="http://bressanini-lescienze.blogautore.espresso.repubblica.it/2015/12/21/le-ricette-scientifiche-il-limoncello-anche-veloce/comment-page-2/"
              className={classes.link}
            >
              Bessarini
            </Link>
            .<br />
            Idea nata da un thread di{' '}
            <Link
              href="https://www.reddit.com/r/italy/comments/ed993f/aggiornamento_del_foglio_calcolatore_per_il/?utm_source=share&utm_medium=web2x&context=3"
              className={classes.link}
            >
              r/italy
            </Link>
            , più nello specifico da questo{' '}
            <Link
              href="https://www.reddit.com/r/italy/comments/ed993f/aggiornamento_del_foglio_calcolatore_per_il/fbj3mbr/?utm_source=reddit&utm_medium=web2x&context=3"
              className={classes.link}
            >
              commento
            </Link>
            .
          </Typography>
          <div
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Typography
              component="button"
              variant="h5"
              className={classes.introStepsTitle}
              onClick={handleClick}
            >
              Spiegazione
            </Typography>
            {!open ? (
              <Help
                fontSize="small"
                onClick={handleClick}
                className={classes.intoHelpIcon}
              />
            ) : (
              <HelpOutline
                fontSize="small"
                onClick={handleClick}
                className={classes.intoHelpIcon}
              />
            )}
          </div>
          {open && (
            <Typography variant="body2" color="primary" display="block">
              <List dense={true}>
                {[
                  'Strofinare i limoni con una spugna pulita',
                  'Pelare i limoni con un pelapatate, rimuovendo con cura la parte bianca',
                  'Inserire il peso delle bucce, la gradazione desiderata (in percentuale) e la percentuale di zucchero desiderato nei rispettivi campi',
                ].map((v, key) => {
                  return <Step text={v}></Step>;
                })}
              </List>
            </Typography>
          )}
          <form noValidate className={classes.form}>
            <Grid
              container
              spacing={2}
              justify="space-around"
              alignItems="center"
            >
              <Grid item xs={12} sm={4}>
                <Field
                  name="peel"
                  required
                  fullWidth
                  id="peel"
                  label="🍋 Bucce"
                  value={values?.peel}
                  onChange={handleChange}
                  component={Input}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">gr</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field
                  required
                  fullWidth
                  id="gradiation"
                  label="🍸 Gradiazione desiderata"
                  name="gradiation"
                  value={values?.gradiation}
                  onChange={handleChange}
                  component={Input}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field
                  required
                  fullWidth
                  id="sugarPerc"
                  label="🍬 Zucchero desiderato"
                  name="sugarPerc"
                  value={values?.sugarPerc}
                  onChange={handleChange}
                  component={Input}
                  InputProps={{
                    type: 'number',
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </form>
          {calculation &&
            calculation.totalWeight &&
            calculation.totalWeight > 0 &&
            requirements &&
            values &&
            values.peel &&
            values.gradiation &&
            values.sugarPerc &&
            isValid && (
              <>
                {open && (
                  <Typography variant="body2" color="primary" display="block">
                    <List dense={true}>
                      {[
                        "Mettere le bucce in macerazione al buio nell'alcol puro (la quantità da utilizzare è riportata qua sotto) per infusione per un periodo tra 1 e 3 giorni",
                        'Agitare occasionalmente',
                      ].map((v, key) => {
                        return <Step text={v}></Step>;
                      })}
                    </List>
                  </Typography>
                )}
                <Grid
                  container
                  spacing={2}
                  justify="space-around"
                  alignItems="center"
                  className={classes.gridPadding}
                >
                  <Grid item xs={12} sm={4}>
                    <RequirementCard
                      label="Alcol necessario"
                      value={[
                        requirements.alcol,
                        Math.round(requirements.alcol * 0.78945),
                      ]}
                      unit={['ml', 'gr']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <RequirementCard
                      label="Acqua necessaria"
                      value={[requirements.water]}
                      unit={['ml']}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <RequirementCard
                      label="Zucchero necessario"
                      value={[requirements.sugar]}
                      unit={['gr']}
                    />
                  </Grid>
                </Grid>
                {open && (
                  <Typography variant="body2" color="primary" display="block">
                    <List dense={true}>
                      {[
                        "Una volta passato il periodo di infusione, preparare lo sciroppo di zucchero facendo scaldare l'acqua e unendoci lo zucchero nelle dosi riportate sopra",
                        'Attendere che lo sciroppo raggiunga la temperatura ambiente',
                        "Filtrare l'infusione rimuovendo tutte le bucce di 🍋",
                        "Mescolare l'infusione con lo sciroppo di zucchero",
                        'Imbottigliare e gustare il preparato, meglio se si attende ancora qualche giorno prima di provarlo',
                      ].map((v, key) => {
                        return <Step text={v}></Step>;
                      })}
                    </List>
                  </Typography>
                )}
              </>
            )}
        </Container>
      </ThemeProvider>
    </>
  );
};

function getFromSugar(weight: number, sugarPercentage: number) {
  const sugar = Math.round((sugarPercentage / 100) * weight);
  const water = Math.round(weight - sugar);
  return {
    sugar,
    water,
  };
}

const calculate = (values: Partial<FormValues>): Calculation => {
  let { peel, gradiation } = values;
  if (!gradiation || !peel || gradiation === 0 || peel === 0) {
    return {
      alcol: 0,
      totalWeight: 0,
    };
  }
  if (gradiation >= 1) {
    gradiation /= 100;
  }
  const alcolDensity = 0.78945;
  const peelWater = 0.7 * peel;
  const alcol = Math.round((peel * 10) / 3);
  const alcolWaterMl = 0.04 * alcol;
  const totalWaterMl = alcolWaterMl + peelWater;
  const alcolPureMl = 0.96 * alcol;
  const mixGradiation = alcolPureMl / (alcolPureMl + totalWaterMl);
  const waterAfterMl = (1 - mixGradiation) * alcol;
  const alcolAfterMl = alcol * mixGradiation;
  const alcolAfterGr = alcolAfterMl * alcolDensity;
  const sugarWaterMl = alcolAfterMl / gradiation - alcolAfterMl - waterAfterMl;
  const totalWeight = sugarWaterMl + waterAfterMl + alcolAfterGr;
  return {
    alcol: Math.round(alcol),
    totalWeight: Math.round(totalWeight),
  };
};

export default App;
