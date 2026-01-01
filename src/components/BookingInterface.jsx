import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Users, CreditCard, CheckCircle, 
  Smartphone, QrCode, Clock, RefreshCcw, Wallet, Landmark,
  Apple
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/utils/translations';

const BookingInterface = ({ routes, language }) => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    route: null,
    date: '',
    time: '',
    passengers: 1,
    paymentStatus: 'pending', // pending, processing, paid, refunded
    paymentMethod: 'card', // card, upi, paytm, gpay, apple, netbanking
    refundStatus: null,
    ticketId: null
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  // Forms state
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const calculateTotal = () => {
    if (!booking.route) return 0;
    const price = parseInt(booking.route.fare.replace(/[^\d]/g, ''));
    return price * booking.passengers;
  };

  const handlePayment = async () => {
    // Basic validation based on method
    let valid = true;
    if (booking.paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) valid = false;
    } else if (booking.paymentMethod === 'upi') {
      // For UPI we support QR scan (no input needed) OR UPI ID
      // If UPI ID input is empty, we assume they scanned QR. 
      // In a real app, scanning happens on device. Here we just assume success.
    } else if (booking.paymentMethod === 'paytm') {
      if (!mobileNumber) valid = false;
    } else if (booking.paymentMethod === 'netbanking') {
      if (!selectedBank) valid = false;
    }

    if (!valid && booking.paymentMethod !== 'upi' && booking.paymentMethod !== 'gpay' && booking.paymentMethod !== 'apple') {
      toast({
        title: t.error,
        description: t.fillAllFields,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingPayment(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    
    const ticketId = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    setBooking(prev => ({
      ...prev,
      paymentStatus: 'paid',
      ticketId: ticketId
    }));

    toast({
      title: t.bookingConfirmed,
      description: `${booking.passengers} ${t.ticket}(s) ${t.booked}`,
    });

    setStep(4);
  };

  const handleRefundRequest = async () => {
    toast({
      title: "Processing Refund",
      description: "Initiating automatic refund...",
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBooking(prev => ({
      ...prev,
      paymentStatus: 'refunded',
      refundStatus: 'completed'
    }));

    toast({
      title: "Refund Successful",
      description: `Amount refunded to ${booking.paymentMethod.toUpperCase()}.`,
    });
  };

  const PaymentMethodSelector = () => (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
      {[
        { id: 'upi', label: t.upi, icon: QrCode },
        { id: 'paytm', label: 'PayTM', icon: Smartphone },
        { id: 'gpay', label: 'GPay', icon: Wallet },
        { id: 'apple', label: 'Apple', icon: Apple },
        { id: 'card', label: t.card, icon: CreditCard },
        { id: 'netbanking', label: 'NetBank', icon: Landmark },
      ].map((method) => (
        <button
          key={method.id}
          onClick={() => setBooking({ ...booking, paymentMethod: method.id })}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
            booking.paymentMethod === method.id
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <method.icon className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">{method.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.booking}</h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                step >= num
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > num ? <CheckCircle className="w-6 h-6" /> : num}
            </div>
            {num < 4 && (
              <div
                className={`flex-1 h-2 mx-2 rounded transition-all ${
                  step > num ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Route */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">{t.selectRoute}</h3>
          <div className="grid grid-cols-1 gap-4">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => { setBooking({ ...booking, route }); setStep(2); }}
                className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-600 hover:bg-blue-50 transition-all text-left w-full"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h4>
                <div className="flex items-center gap-2 text-gray-600 text-base">
                  <MapPin className="w-5 h-5" />
                  <span>{route.from} → {route.to}</span>
                </div>
                <div className="mt-2 text-lg font-semibold text-blue-600">{route.fare}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && booking.route && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">{t.selectDateTime}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">{t.date}</label>
              <input
                type="date"
                value={booking.date}
                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">{t.time}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {booking.route.schedule.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBooking({ ...booking, time: slot.departure })}
                    className={`p-4 rounded-lg border-2 text-lg font-semibold transition-all ${
                      booking.time === slot.departure
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {slot.departure}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={() => setStep(3)} className="w-full py-6 text-xl font-bold" size="lg">
            {t.continue}
          </Button>
        </motion.div>
      )}

      {/* Step 3: Payment Interface */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">{t.paymentMethod}</h3>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">{t.numberOfPassengers}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBooking({ ...booking, passengers: Math.max(1, booking.passengers - 1) })}
                  className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full font-bold text-xl hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-800 w-8 text-center">{booking.passengers}</span>
                <button
                  onClick={() => setBooking({ ...booking, passengers: Math.min(10, booking.passengers + 1) })}
                  className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full font-bold text-xl hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-lg border-t border-gray-200 pt-4">
              <span className="font-semibold">{t.totalFare}:</span>
              <span className="text-2xl font-bold text-blue-600">₹{calculateTotal()}</span>
            </div>
          </div>

          <PaymentMethodSelector />

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm min-h-[300px]">
            {booking.paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                  <CreditCard className="w-5 h-5" /> {t.card}
                </div>
                <input 
                  type="text" placeholder={t.cardNumber} value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder={t.expiry} value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <input 
                    type="text" placeholder={t.cvc} value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <input 
                  type="text" placeholder={t.nameOnCard} value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {booking.paymentMethod === 'upi' && (
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <QrCode className="w-40 h-40 text-gray-800 mb-2" />
                  <p className="text-sm font-medium text-gray-600">{t.scanQrCode}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
                  <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">OR</span></div>
                </div>
                <input 
                  type="text" placeholder={t.enterUpiId + " (e.g. user@upi)"} value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {booking.paymentMethod === 'paytm' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                  <Smartphone className="w-5 h-5" /> PayTM Wallet
                </div>
                <p className="text-sm text-gray-500 mb-2">Link your PayTM wallet to pay instantly.</p>
                <input 
                  type="tel" placeholder={t.enterMobile} value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {booking.paymentMethod === 'gpay' && (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                    <Wallet className="w-8 h-8" />
                 </div>
                 <h4 className="text-lg font-semibold">Google Pay</h4>
                 <p className="text-center text-gray-500 text-sm max-w-xs">
                    You will be redirected to Google Pay to complete your secure payment.
                 </p>
              </div>
            )}
            
            {booking.paymentMethod === 'apple' && (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 mb-2">
                    <Apple className="w-8 h-8" />
                 </div>
                 <h4 className="text-lg font-semibold">Apple Pay</h4>
                 <p className="text-center text-gray-500 text-sm max-w-xs">
                    Authenticate with Face ID or Touch ID to pay securely.
                 </p>
              </div>
            )}

            {booking.paymentMethod === 'netbanking' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                  <Landmark className="w-5 h-5" /> {t.netBanking}
                </div>
                <select 
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">{t.selectBank}</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className={`w-full py-6 text-xl font-bold transition-all ${isProcessingPayment ? 'opacity-70' : ''}`}
            size="lg"
          >
            {isProcessingPayment ? (
              <span className="flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 animate-spin" /> Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                {t.payWith} {booking.paymentMethod === 'netbanking' ? 'Net Banking' : 
                   booking.paymentMethod === 'gpay' ? 'Google Pay' : 
                   booking.paymentMethod === 'apple' ? 'Apple Pay' : 
                   booking.paymentMethod.toUpperCase()} - ₹{calculateTotal()}
              </span>
            )}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>100% Secure Payment</span>
          </div>
        </motion.div>
      )}

      {/* Step 4: Confirmation & Receipt */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
          {booking.paymentStatus === 'refunded' ? (
             <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
               <RefreshCcw className="w-12 h-12 text-orange-600" />
             </div>
          ) : (
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
               <CheckCircle className="w-16 h-16 text-green-600" />
             </div>
          )}
         
          <h3 className="text-3xl font-bold text-gray-800">
            {booking.paymentStatus === 'refunded' ? 'Refund Processed' : t.bookingConfirmed}
          </h3>

          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg text-left max-w-md mx-auto">
            <div className="bg-blue-600 p-4 text-white text-center">
              <h4 className="font-bold text-xl tracking-wider">E-TICKET</h4>
              <p className="text-sm opacity-90">Rural Bus Service</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                 <div>
                   <p className="text-xs text-gray-500 uppercase tracking-wide">Ticket ID</p>
                   <p className="font-mono font-bold text-lg text-gray-800">{booking.ticketId}</p>
                 </div>
                 <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                      booking.paymentStatus === 'refunded' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                 </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">{t.route}:</span>
                  <span className="font-bold text-gray-800">{booking.route?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">{t.date}:</span>
                  <span className="font-bold text-gray-800">{booking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">{t.time}:</span>
                  <span className="font-bold text-gray-800">{booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">{t.passengers}:</span>
                  <span className="font-bold text-gray-800">{booking.passengers}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-600 font-medium">{t.paymentMethod}:</span>
                   <span className="font-bold text-gray-800 uppercase">{booking.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                  <span className="text-gray-600 font-bold">{t.totalFare}:</span>
                  <span className="text-xl font-bold text-blue-600">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center pt-4 border-t border-gray-100">
                 <QrCode className="w-32 h-32 text-gray-800 mb-2" />
                 <p className="text-xs text-gray-500">Scan to board bus</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 text-xs text-center text-gray-500 border-t border-gray-200">
               Show this QR code to the conductor. <br/>
               Refund available if not boarded 30 mins post-departure.
            </div>
          </div>
          
          {booking.paymentStatus === 'paid' && (
             <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h5 className="font-bold text-orange-800 mb-2 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" /> Demo: Automatic Refund
                </h5>
                <p className="text-sm text-orange-700 mb-3">
                  (Simulate "No-Show" scenario: Passenger didn't board 30 mins after departure)
                </p>
                <Button 
                   onClick={handleRefundRequest}
                   variant="outline"
                   className="border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                >
                   Simulate Auto-Refund
                </Button>
             </div>
          )}

          <Button
            onClick={() => {
              setStep(1);
              setBooking({ 
                route: null, date: '', time: '', passengers: 1, 
                paymentStatus: 'pending', paymentMethod: 'card', 
                refundStatus: null, ticketId: null 
              });
              setCardDetails({ number: '', expiry: '', cvc: '', name: '' });
              setUpiId(''); setMobileNumber(''); setSelectedBank('');
            }}
            className="w-full py-6 text-xl font-bold mt-4"
            size="lg"
          >
            {t.bookAnother}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default BookingInterface;