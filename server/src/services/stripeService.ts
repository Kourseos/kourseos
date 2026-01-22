import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16' as any,
});

export const createCheckoutSession = async (
    courseId: string,
    courseTitle: string,
    price: number,
    currency: string = 'usd',
    paymentType: string = 'ONE_TIME',
    customerEmail?: string
) => {
    try {
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: courseTitle,
                            description: `Acceso al curso: ${courseTitle}`,
                        },
                        unit_amount: Math.round(price * 100), // Stripe usa centavos
                        recurring: paymentType === 'SUBSCRIPTION' ? { interval: 'month' } : undefined,
                    },
                    quantity: 1,
                },
            ],
            mode: paymentType === 'SUBSCRIPTION' ? 'subscription' : 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/landing/${courseId}`,
            customer_email: customerEmail,
            metadata: {
                courseId,
                paymentType
            }
        };

        const session = await stripe.checkout.sessions.create(sessionParams);
        return session;
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        throw error;
    }
};

export const verifyWebhookSignature = (payload: string | Buffer, signature: string, secret: string) => {
    return stripe.webhooks.constructEvent(payload, signature, secret);
};

export default stripe;
