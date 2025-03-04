"use server";

import { format } from "date-fns";
import { getServerSession } from "next-auth";

import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface CreateClientParams {
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  address?: {
    city?: string;
    state?: string;
    number?: string;
    street?: string;
    zipCode?: string;
    neighborhood?: string;
    complement?: string | undefined;
  };
}

export const createClient = async (params: CreateClientParams) => {
  const user = await getServerSession(authOptions);

  if (!user) throw new Error("Usuário não autenticado");

  const clientCreated = await db.client.create({
    data: {
      name: params.name,
      email: params.email,
      phone: params.phone,
      userId: (user.user as any).id,
      birthDate: format(new Date(params.birthDate), "yyyy-MM-dd"),
    },
  });

  await db.address.create({
    data: { ...params.address, clientId: clientCreated.id },
  });
};
