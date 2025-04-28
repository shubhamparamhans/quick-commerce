import React from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  address: Yup.string().required('Address is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
});

const Checkout: React.FC = () => {
  const cart = useSelector((state: any) => state.cart);
  const totalPrice = cart.reduce((total: number, item: any) => total + item.price, 0);

  return (
    <div className="p-5 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div className="w-full md:w-2/3">
        <Formik
          initialValues={{ address: '', paymentMethod: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            alert('Order placed successfully!');
            console.log(values);
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Address</label>
                <Field as="textarea" name="address" className="w-full border p-2 rounded" />
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Payment Method</label>
                <Field as="select" name="paymentMethod" className="w-full border p-2 rounded">
                  <option value="">Select a payment method</option>
                  <option value="credit">Credit Card</option>
                  <option value="paypal">PayPal</option>
                </Field>
                <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm" />
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Place Order
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-bold">Order Summary</h2>
        {cart.map((item: any) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;