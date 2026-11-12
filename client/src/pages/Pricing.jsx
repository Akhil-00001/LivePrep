import React, { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useToast } from '../components/ToastProvider';
function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 interview credits",
        "Basic performance report",
        "Voice interviews",
        "Limited report history",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 interview credits",
        "Detailed feedback",
        "Performance charts",
        "Full report history",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 interview credits",
        "Advanced feedback",
        "Skill trends over time",
        "Priority processing",
      ],
      badge: "Best value",
    },
  ];



  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.data.amount,
      currency: "INR",
      name: "LivePrep",
      description: `${plan.name} - ${plan.credits} Credits`,
      order_id: result.data.id,

      handler:async function (response) {
        const verifypay = await axios.post(ServerUrl + "/api/payment/verify" ,response , {withCredentials:true})
        dispatch(setUserData(verifypay.data.user))

          showToast("Payment successful. Credits added!", "success");
          navigate("/")

      },
      theme:{
        color: "#17233A",
      },

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
     console.log(error)
     setLoadingPlan(null);
    }
  }



  return (
    <div>
      <h1 className='page-title'>Buy interview credits</h1>
      <p className='page-lede'>
        Each interview uses credits. Packs are one-time payments, with no subscription.
      </p>

      <div className='mt-10 grid gap-px overflow-hidden rounded-md border border-rule bg-rule md:grid-cols-3'>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <section
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative flex flex-col bg-sheet p-6 sm:p-8 ${plan.default ? '' : 'cursor-pointer'} ${isSelected && !plan.default ? 'shadow-[inset_0_0_0_2px_var(--color-ink)]' : ''}`}
            >
              <div className='flex items-baseline justify-between gap-3'>
                <h2 id={`plan-${plan.id}`} className='text-title font-semibold'>
                  {plan.badge ? <span className='mark'>{plan.name}</span> : plan.name}
                </h2>
                {plan.badge && <span className='text-caption font-semibold'>{plan.badge}</span>}
                {plan.default && <span className='text-caption text-graphite'>Included</span>}
              </div>

              <p className='mt-6 flex items-baseline gap-2'>
                <span className='num voice text-display leading-none'>{plan.price}</span>
              </p>
              <p className='num mt-2 text-graphite'>{plan.credits} credits</p>

              <p className='mt-5 text-graphite'>{plan.description}</p>

              <ul className='mt-6 space-y-2.5 border-t border-rule pt-6'>
                {plan.features.map((feature, i) => (
                  <li key={i} className='flex items-start gap-3'>
                    <FiCheck aria-hidden className='mt-1 shrink-0' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className='mt-auto pt-8'>
                {plan.default ? (
                  <p className='text-caption text-graphite'>Every new account starts with these credits.</p>
                ) : (
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id)
                      } else {
                        handlePayment(plan)
                      }
                    }}
                    className={`btn w-full py-3 ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {loadingPlan === plan.id
                      ? "Opening checkout…"
                      : isSelected
                        ? `Pay ${plan.price}`
                        : "Choose this pack"}
                  </button>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <p className='mt-6 text-caption text-graphite'>Payments are handled securely by Razorpay.</p>
    </div>
  )
}

export default Pricing
