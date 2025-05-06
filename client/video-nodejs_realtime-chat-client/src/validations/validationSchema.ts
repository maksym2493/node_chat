import * as Yup from 'yup';

export const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Name is required')
    .min(6, 'At least 6 characters')
    .max(50, 'At most 50 characters'),
});
