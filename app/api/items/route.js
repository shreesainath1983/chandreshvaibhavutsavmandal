import { NextResponse } from 'next/server';
let items = [];

export async function GET() {
  return NextResponse.json(items);
}

export async function POST(req) {
  const data = await req.json();
  items.push(data);
  return NextResponse.json({ success: true, items });
}

export async function DELETE(req) {
  const { id } = await req.json();
  items = items.filter(i => i.id !== id);
  return NextResponse.json({ success: true, items });
}

export async function PUT(req) {
  const { id, updates } = await req.json();
  items = items.map(i => i.id === id ? { ...i, ...updates } : i);
  return NextResponse.json({ success: true, items });
}