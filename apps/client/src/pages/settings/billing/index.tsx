import { Elements } from '@stripe/react-stripe-js';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@client/pages/settings/billing/checkout-form';
import { useState } from 'react';
import { RepositoryFactory } from '@client/api/repository-factory';
import { AxiosResponse } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@client/components/ui/dialog';
import { useTheme } from '@client/components/theme-provider';
import { find, get, throttle } from 'lodash';
import PricingPage, {
  tiers,
} from '@client/pages/settings/billing/tier/pricing-page';
import { toast } from '@client/components/ui/use-toast';

const UserRepository = RepositoryFactory.get('user');

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const appearance: Appearance = {
  theme: 'night',
  variables: {
    fontFamily: ' "Gill Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '10px',
    // colorBackground: '#F6F8FA',
    // accessibleColorOnColorPrimary: '#262626',
  },
};

export default function BillingSetting() {
  const { theme } = useTheme();
  const [clientSecret, setClientSecret] = useState('');
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    plan: 0,
    frequency: '1',
  });

  const fetchSecret = throttle((plan: number, frequency: string) => {
    if (loadingSecret || clientSecret) return;
    setLoadingSecret(true);
    UserRepository.createPaymentIndent({
      plan: plan,
      frequency,
    })
      .then(async (result: AxiosResponse) => {
        const clientSecret = result.data;
        setClientSecret(clientSecret);

        setOpenPayment(true);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Fetch Stripe Client Secret failed. Retry',
        });
      })
      .finally(() => setLoadingSecret(false));
  }, 300);

  const tier = get(
    find(tiers, (e) => e.value === selectedPlan.plan),
    ['price', selectedPlan.frequency],
  );

  return (
    <div className={'w-full'}>
      <PricingPage
        open={(plan, frequency) => {
          setSelectedPlan({
            plan,
            frequency,
          });
          fetchSecret(plan, frequency);
        }}
      />
      <Dialog open={openPayment} onOpenChange={setOpenPayment}>
        <DialogContent className="sm:max-w-[885px] flex space-x-4">
          <div className={'flex-1'}>
            <DialogHeader>
              <DialogTitle>Upgrade to business</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {clientSecret && clientSecret !== '' ? (
              <Elements
                stripe={stripePromise}
                options={{
                  appearance: {
                    ...appearance,
                    theme: 'night',
                  },
                  clientSecret: clientSecret,
                }}
              >
                <CheckoutForm />
              </Elements>
            ) : null}
          </div>
          <div className={'w-[300px] h-full'}>
            <div className={'text-xl font-bold'}>Order summary</div>
            <div className={'flex flex-col'}>
              <div className={'flex justify-between font-semibold'}>
                <div>
                  {selectedPlan?.frequency === '1' ? 'Monthly' : 'Annually'}{' '}
                  package
                </div>
                <div>{tier}</div>
              </div>
              <div className={'flex justify-between text-xs text-slate-500'}>
                <div>250,000 events per month</div>
                <div>billed monthy</div>
              </div>
              <div
                className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} p-3 rounded-lg my-3 text-xs`}
              >
                If you consume over 250,000 events per month, you will be billed
                monthly for an overage based on the table below
              </div>
              <div
                className={
                  'inline-flex space-x-1 items-center text-sm justify-center'
                }
              >
                <span>Questions?</span>
                <a href={'/contact'} className={'underline'}>
                  Contact our sales team
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
