import React from 'react';
import * as Yup from 'yup';
import cn from 'classnames';

import { AxiosError } from 'axios';
import { Field, Form, Formik } from 'formik';

import { usePageError } from '../hooks/usePageError';
import { roomService } from '../services/roomService';

type ApiError = AxiosError<{
  message: string;
  errors?: { name?: string };
}>;

interface Props {
  id: string;
  name: string;
  onChange: () => void;
}

function generateScheme(newName: string) {
  return Yup.object({
    newName: Yup.string()
      .trim()
      .required('Name is required')
      .min(6, 'At least 6 characters')
      .max(50, 'At most 50 characters')
      .notOneOf([newName], 'New name should be different'),
  });
}

export const RoomNameForm: React.FC<Props> = ({ id, name, onChange }) => {
  const [error, setError] = usePageError('');

  return (
    <>
      <Formik
        initialValues={{ newName: name }}
        validateOnMount={true}
        validationSchema={generateScheme(name)}
        onSubmit={({ newName }, formikHelpers) => {
          roomService
            .changeName(id, newName)
            .then(() => onChange())
            .catch((err: ApiError) => {
              if (err.message) setError(err.message);
              if (!err.response?.data) return;

              const { errors, message } = err.response.data;

              formikHelpers.setFieldError('newName', errors?.name);

              if (message) setError(message);
            })
            .finally(() => formikHelpers.setSubmitting(false));

          return;
        }}
      >
        {({ touched, errors, isSubmitting, isValid, dirty, setTouched }) => (
          <Form>
            <div className="field is-flex mb-2">
              <Field
                name="newName"
                type="text"
                id="newName"
                autoComplete="off"
                placeholder="e.g. Hello Party"
                className={cn('input mr-2', {
                  'is-danger': touched.newName && errors.newName,
                })}
                onKeyDown={async (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    await setTouched({ newName: true });
                  }
                }}
              />

              <div className="control">
                <button
                  type="submit"
                  className={cn('button is-success has-text-weight-bold', {
                    'is-loading': isSubmitting,
                  })}
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  Change
                </button>
              </div>
            </div>

            {touched.newName && errors.newName && (
              <p className="help is-danger">{errors.newName}</p>
            )}
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light mt-2">{error}</p>}
    </>
  );
};
