import cn from 'classnames';
import { AxiosError } from 'axios';
import { Formik, Form, Field } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import { Loader } from '../components/Loader';
import { useAuth } from '../components/authContext';

import { usePageError } from '../hooks/usePageError';
import { validationSchema } from '../validations/validationSchema';

export type ApiError = AxiosError<{
  message: string;
  errors?: { name?: string };
}>;

export const LoginPage = () => {
  const [error, setError] = usePageError('');
  const { isChecked, register } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  if (!isChecked) {
    return <Loader />;
  }

  return (
    <>
      <Formik
        initialValues={{ name: '' }}
        validateOnMount={true}
        validationSchema={validationSchema}
        onSubmit={({ name }, formikHelpers) => {
          register(name)
            .then(async () => {
              const state = location.state as { from?: Location } | undefined;

              await navigate(state?.from?.pathname ?? '/', { replace: true });
            })
            .catch((error: ApiError) => {
              if (error.message) setError(error.message);
              if (!error.response?.data) return;

              const { errors, message } = error.response.data;

              formikHelpers.setFieldError('name', errors?.name);

              if (message) setError(message);
            })
            .finally(() => formikHelpers.setSubmitting(false));
        }}
      >
        {({ touched, errors, isSubmitting, isValid }) => (
          <Form className="box">
            <h1 className="title">Sign up</h1>
            <div className="field">
              <label htmlFor="name" className="label">
                Name
              </label>

              <div className="control has-icons-left has-icons-right">
                <Field
                  name="name"
                  type="text"
                  id="name"
                  placeholder="e.g. Bob Smith"
                  className={cn('input', {
                    'is-danger': touched.name && errors.name,
                  })}
                />

                <span className="icon is-small is-left">
                  <i className="fa fa-user"></i>
                </span>

                {touched.name && errors.name && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>

              {touched.name && errors.name && (
                <p className="help is-danger">{errors.name}</p>
              )}
            </div>
            <div className="field">
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', {
                  'is-loading': isSubmitting,
                })}
                disabled={isSubmitting || !isValid}
              >
                Sign up
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </>
  );
};
