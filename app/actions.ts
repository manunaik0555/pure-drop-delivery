"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInitialData() {
  const inventory = await prisma.inventory.findMany({ orderBy: { id: "asc" } });
  const orders = await prisma.order.findMany({ orderBy: { date: "desc" } });
  
  let setting = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!setting) {
    setting = await prisma.setting.create({ data: { id: 1, liveTicker: "Welcome to Seetha Mehesh Enterprises!" } });
  }

  return { inventory, orders, liveTicker: setting.liveTicker };
}

export async function addStockAction(brand: string, product: string, stock: number, price: number) {
  return await prisma.inventory.create({ data: { brand, product, stock, price } });
}

export async function updateStockAction(id: number, brand: string, product: string, stock: number, price: number) {
  return await prisma.inventory.update({ where: { id }, data: { brand, product, stock, price } });
}

export async function toggleOrderStatusAction(id: string, newStatus: string) {
  return await prisma.order.update({ where: { id }, data: { status: newStatus } });
}

export async function updateTickerAction(liveTicker: string) {
  return await prisma.setting.update({ where: { id: 1 }, data: { liveTicker } });
}