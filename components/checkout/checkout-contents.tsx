"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  Environments,
  initializePaddle,
  Paddle,
  Theme,
} from "@paddle/paddle-js";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { useTheme } from "next-themes";

import { PriceSection } from "@/components/checkout/price-section";

interface PathParams {
  priceId: string;
  [key: string]: string | string[];
}

interface Props {
  userEmail: string;
  userId: string;
}

export function CheckoutContents({ userEmail, userId }: Props) {
  const { resolvedTheme } = useTheme();
  const { priceId } = useParams<PathParams>();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null
  );

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  useEffect(() => {
    if (
      !paddle?.Initialized &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        eventCallback: (event) => {
          if (event.data && event.name) {
            handleCheckoutEvents(event.data);
          }
        },
        checkout: {
          settings: {
            frameStyle:
              "width: 100%; background-color: transparent; border: none",
            successUrl: "/checkout/success",
          },
        },
      }).then(async (paddle) => {
        if (paddle) {
          setPaddle(paddle);
        }
      });
    }
  });

  useEffect(() => {
    if (paddle?.Initialized) {
      paddle.Checkout.open({
        ...(userEmail && { customer: { email: userEmail } }),
        items: [{ priceId: priceId, quantity: 1 }],
        settings: {
          displayMode: "inline",
          theme: resolvedTheme as Theme,
          allowLogout: !userEmail,
          frameTarget: "paddle-checkout-frame",
          frameInitialHeight: 450,
        },
        customData: {
          user_id: userId,
        },
      });
    }
  }, [paddle, resolvedTheme, priceId, userEmail, userId]);

  return (
    <div
      className={
        "rounded-lg md:bg-background/80 md:backdrop-blur-[24px] md:pt-10 md:min-h-[400px] flex items-center justify-center relative"
      }
    >
      <div className={"flex flex-col md:flex-row gap-8 md:gap-16"}>
        <div className={"w-full md:w-[400px]"}>
          <PriceSection checkoutData={checkoutData} />
        </div>
        <div className={"min-w-[375px] lg:min-w-[535px]"}>
          <div
            className={"text-base leading-[20px] font-semibold mb-8 ml-[10px]"}
          >
            Payment details
          </div>
          <div className={"paddle-checkout-frame"} />
        </div>
      </div>
    </div>
  );
}
