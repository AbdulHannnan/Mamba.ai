import type { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../configs/prisma.js";

const clerkwebhook = async (req: Request, res: Response) => {
  try {
    const evt: any = await verifyWebhook(req);

    // Getting the data from the request body
    const { data, type } = evt;

    // Switch case to handle the events
    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            id: data.id,
            email: data?.email_addresses?.[0]?.email_address,
            name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
            image: data?.image_url,
          },
        });

        break;
      }

      case "user.updated": {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            email: data?.email_addresses?.[0]?.email_address,
            name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
            image: data?.image_url,
          },
        });

        break;
      }

      case "user.deleted": {
        await prisma.user.delete({
          where: {
            id: data.id,
          },
        });

        break;
      }

      case "paymentAttempt.updated": {
        if (
          (data.chargeType === "recurring" || data.chargeType === "checkout") &&
          data.status === ""
        ) {
          const credit = {
            pro: 80,
            max: 240,
          } as const;

          const clerkUserId = data?.payer?.user_id;

          const planId = data?.supsciption_item?.[0]?.plan?.slug as
            | keyof typeof credit
            | undefined;

          if (planId !== "pro" && planId !== "max") {
            console.log("Invalid plan id");
            return res.status(400).json({ message: "Invalid plan id" });
          }

          await prisma.user.update({
            where: {
              id: clerkUserId,
            },
            data: {
              credits: {
                increment: credit[planId],
              },
            },
          });
        }

        break;
      }

      default: {
        break;
      }
    }

    return res
      .status(200)
      .json({ message: "Webhook received successfully: " + type });
  } catch (error: any) {
    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

export default clerkwebhook;