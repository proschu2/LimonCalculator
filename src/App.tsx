import React, { FC, useEffect, useState } from "react";
import "./App.css";
import {
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as _ from "lodash";
import { createMuiTheme } from "@material-ui/core/styles";
import { lime, indigo } from "@material-ui/core/colors";
import {
  Field,
  FieldProps,
  Formik,
  FormikHelpers,
  FormikProps,
  getIn,
  useFormikContext,
} from "formik";
import * as yup from "yup";
import { mapValues } from "lodash";

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: lime,
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    flexGrow: 1,
    padding: "24px",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  container: {
    padding: "24px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "50%",
  },
}));

const Input: FC<FieldProps & TextFieldProps> = (props) => {
  const isTouched = getIn(props.form.touched, props.field.name);
  const errorMessage = getIn(props.form.errors, props.field.name);

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
    />
  );
};

interface FormValues {
  peel: string;
  gradiation: string;
}

interface Calculation {
  alcol: number;
  totalWeight: number;
}

const validationSchema = yup.object().shape({
  peel: yup.string().required("Necessario"),
  gradiation: yup
    .string()
    .required("Necessario")
    .min(1, "Inserisci una percentuale"),
});

const Form = () => {
  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        peel: "120",
        gradiation: "35",
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormValues,
        formikHelpers: FormikHelpers<FormValues>
      ) => {
        onSubmit(values);
        formikHelpers.setSubmitting(false);
      }}
    >
      <LemonForm />
    </Formik>
  );
};

const LemonForm = () => {
  const {
    values,
    handleChange,
    errors,
    isValid, // will work with validation schema or validate fn defined
  } = useFormikContext<FormValues>();
  const [calculation, setCalculation] = useState<Calculation>();
  useEffect(() => {
    const newVals = calculate(values);
    setCalculation(calculate(values));
  }, [values]);
  const classes = useStyles();
  return (
    <>
      <Container component="main" maxWidth="sm" className={classes.container}>
        <CssBaseline />

        <Typography component="h1" variant="h5">
          LimonCalculator
        </Typography>
        <form noValidate className={classes.form}>
          <Grid
            container
            spacing={2}
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={12} sm={6}>
              <Field
                name="peel"
                required
                fullWidth
                id="peel"
                label="Bucce (gr)"
                value={values?.peel}
                onChange={handleChange}
                component={Input}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                required
                fullWidth
                id="gradiation"
                label="Gradiazione %"
                name="gradiation"
                value={values?.gradiation}
                onChange={handleChange}
                component={Input}
              />
            </Grid>
            {/*<Grid item xs={12} sm={6}>
            <Input
              required
              fullWidth
              variant="outlined"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>*/}
          </Grid>
        </form>

        {calculation &&
          calculation.totalWeight &&
          calculation.totalWeight > 0 &&
          isValid && (
            <Results values={values} totalWeight={calculation.totalWeight} />
          )}
      </Container>
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

const calculate = (values: FormValues): Calculation => {
  let { peel: Peel, gradiation: Gradiation } = values;
  let peel = Number(Peel);
  let gradiation = Number(Gradiation);
  console.log(peel, gradiation);
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
    alcol,
    totalWeight: Math.round(totalWeight),
  };
};

interface IResult {
  totalWeight: number;
  values: FormValues;
}

interface ResultsRow {
  sugar: number;
  water: number;
}

const Results: FC<IResult> = (props) => {
  const classes = useStyles();

  const amounts: { key: number; sugar: number; water: number }[] = _.range(
    18,
    30
  ).map((i: number, k: number) => {
    return {
      key: i,
      ...getFromSugar(props.totalWeight, i),
    };
  });
  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Risultato
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Zucchero %</TableCell>
            <TableCell>Acqua</TableCell>
            <TableCell>Zucchero</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {amounts.map((row) => (
            <TableRow key={row.key}>
              <TableCell>{row.key}</TableCell>
              <TableCell>{row.water} ml</TableCell>
              <TableCell>{row.sugar} gr</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Form />
    </ThemeProvider>
  );
}

export default App;
