import cn from 'classnames';

import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { usePageError } from '../hooks/usePageError';
import { messageService } from '../services/messageService';

const validationSchema = Yup.object({
  text: Yup.string()
    .trim()
    .required('Message is required')
    .min(6, 'Message must be at least 6 characters')
    .max(100, 'Message must be at most 100 characters'),
});

type ApiError = AxiosError<{
  message: string;
  errors?: { text?: string };
}>;

export const MessageForm = ({ roomId }: { roomId: string }) => {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');

  return (
    <>
      <Formik
        initialValues={{ text: '' }}
        validateOnMount={true}
        validationSchema={validationSchema}
        onSubmit={({ text }, formikHelpers) => {
          messageService
            .send(roomId, text)
            .then(() => formikHelpers.resetForm())
            .catch((err: ApiError) => {
              if (err.status === 404) {
                return navigate('/', { replace: true });
              }

              if (err.message) setError(err.message);
              if (!err.response?.data) return;

              const { errors, message } = err.response.data;

              formikHelpers.setFieldError('text', errors?.text);

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
                name="text"
                type="text"
                id="text"
                autoComplete="off"
                placeholder="e.g. Hello everyone!"
                className={cn('input mr-2', {
                  'is-danger': touched.text && errors.text,
                })}
                onKeyDown={async (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    await setTouched({ text: true });
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
                  Send
                </button>
              </div>
            </div>

            {touched.text && errors.text && (
              <p className="help is-danger">{errors.text}</p>
            )}
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </>
  );
};
