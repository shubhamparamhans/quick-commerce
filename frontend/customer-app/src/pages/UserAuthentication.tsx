import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const UserAuthentication: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (values: any) => {
    if (isLogin) {
      alert('Logged in successfully!');
    } else {
      alert('Registered successfully!');
    }
    console.log(values);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h1>
      <Formik
        initialValues={isLogin ? { email: '', password: '' } : { name: '', email: '', password: '' }}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Field type="text" name="name" className="w-full border p-2 rounded" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Field type="email" name="email" className="w-full border p-2 rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Field type="password" name="password" className="w-full border p-2 rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
      <p className="mt-4 text-center">
        {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
        <button
          type="button"
          className="text-blue-500 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default UserAuthentication;