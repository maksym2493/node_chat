/* eslint-disable @typescript-eslint/no-explicit-any */
import cn from 'classnames';
import { useRef } from 'react';
import { AxiosError } from 'axios';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';

import { usePageError } from '../hooks/usePageError';
import { validationSchema } from '../validations/validationSchema';

import { roomService } from '../services/roomService';

interface Values {
  name: string;
}

enum SubmitAction {
  join,
  create,
}

export type ApiError = AxiosError<{
  message: string;
  errors?: { name?: string; roomId?: string };
}>;

export const RoomForm = () => {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const action = useRef<SubmitAction | null>(null);

  return (
    <>
      <Formik<Values>
        initialValues={{ name: '' }}
        validateOnMount={true}
        validationSchema={validationSchema}
        onSubmit={({ name }, formikHelpers) => {
          (action.current === SubmitAction.create
            ? roomService.create
            : roomService.join)(name)
            .then(room => navigate(`/${room.id}`, { state: room }))
            .catch((err: ApiError) => {
              if (err.message) setError(err.message);
              if (!err.response?.data) return;

              const { errors, message } = err.response.data;

              formikHelpers.setFieldError(
                'name',
                errors?.name ?? errors?.roomId,
              );

              if (message) setError(message);
            })
            .finally(() => formikHelpers.setSubmitting(false));

          return;
        }}
      >
        {({ touched, errors, isSubmitting, isValid, handleSubmit }) => (
          <Form className="box">
            <h1 className="title">Create or Join Room</h1>
            <div className="field">
              <label htmlFor="name" className="label">
                Name
              </label>

              <div className="control has-icons-left has-icons-right">
                <Field name="name">
                  {({ field, form }: any) => (
                    <div className="control has-icons-left has-icons-right">
                      <input
                        {...field}
                        type="text"
                        id="name"
                        autoComplete="auto"
                        placeholder="e.g. Happy Party"
                        className={cn('input', {
                          'is-danger': touched.name && errors.name,
                        })}
                        onChange={e => {
                          action.current = null;
                          form.setFieldValue(field.name, e.target.value);
                        }}
                      />
                    </div>
                  )}
                </Field>

                <span className="icon is-small is-left">
                  <i className="fa fa-comments"></i>
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
                className={cn('button is-success has-text-weight-bold mr-2', {
                  'is-loading':
                    isSubmitting &&
                    action.current !== null &&
                    action.current === SubmitAction.create,
                })}
                disabled={
                  isSubmitting ||
                  (!isValid &&
                    (action.current === null ||
                      action.current === SubmitAction.create))
                }
                onClick={() => {
                  action.current = SubmitAction.create;
                  handleSubmit();
                }}
              >
                Create
              </button>

              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', {
                  'is-loading':
                    isSubmitting &&
                    action.current !== null &&
                    action.current === SubmitAction.join,
                })}
                disabled={
                  isSubmitting ||
                  (!isValid &&
                    (action.current === null ||
                      action.current === SubmitAction.join))
                }
                onClick={() => {
                  action.current = SubmitAction.join;
                  handleSubmit();
                }}
              >
                Join
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </>
  );
};
