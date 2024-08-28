import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_stripe_publishable_key');

const CheckoutForm: React.FC<{ onPaymentSuccess: () => void }> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: backendError, clientSecret } = await fetch('http://localhost:3001/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 99 }),
    }).then((res) => res.json());

    if (backendError) {
      setError(backendError.message);
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onPaymentSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay $0.99'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

const Payment: React.FC<{ onPaymentSuccess: () => void }> = ({ onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
};

export default Payment;