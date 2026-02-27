"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Fetch all data on load
export async function getInitialData() {
  const inventory = await prisma.inventory.findMany({ orderBy: { id: "asc" } });
  const orders = await prisma.order.findMany({ orderBy: { date: "desc" } });
  
  // Ensure a settings row exists for the ticker
  let setting = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!setting) {
    setting = await prisma.setting.create({ data: { id: 1, liveTicker: "Welcome to Pure Drop! 24/7 Delivery." } });
  }

  return { inventory, orders, liveTicker: setting.liveTicker };
}

// 2. Add new stock
export async function addStockAction(brand: string, product: string, stock: number, price: number) {
  return await prisma.inventory.create({
    data: { brand, product, stock, price }
  });
}

// 3. Update existing stock
export async function updateStockAction(id: number, brand: string, product: string, stock: number, price: number) {
  return await prisma.inventory.update({
    where: { id },
    data: { brand, product, stock, price }
  });
}

// 4. Update order status
export async function toggleOrderStatusAction(id: string, newStatus: string) {
  return await prisma.order.update({
    where: { id },
    data: { status: newStatus }
  });
}

// 5. Update the live ticker
export async function updateTickerAction(liveTicker: string) {
  return await prisma.setting.update({
    where: { id: 1 },
    data: { liveTicker }
  });
}