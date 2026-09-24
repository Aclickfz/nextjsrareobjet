import { canTransition, nextPaymentStatus, shippingFlat } from '../src/lib/utils.ts';

const failures = [];
function check(name, ok) {
  if (!ok) failures.push(name);
  console.log(ok ? 'PASS' : 'FAIL', name);
}

check('pending to confirmed', canTransition('pending', 'confirmed'));
check('pending not to shipped', !canTransition('pending', 'shipped'));
check('confirmed to cancelled', canTransition('confirmed', 'cancelled'));
check('delivered is terminal', !canTransition('delivered', 'cancelled'));
check('empty cart shipping 0', shippingFlat(0) === 0);
check('flat shipping default', shippingFlat(2) === Number(process.env.SHIPPING_FLAT_INR || 99));
check('delivered marks paid', nextPaymentStatus('unpaid', 'delivered') === 'paid');
check('cancel refunds paid', nextPaymentStatus('paid', 'cancelled') === 'refunded');
check('pending stays unpaid', nextPaymentStatus('unpaid', 'confirmed') === 'unpaid');

if (failures.length) {
  console.error(failures);
  process.exit(1);
}
console.log('logic cases passed');
