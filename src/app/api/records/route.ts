import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const config: Record<string, { model: string; fields: string[]; required: string[] }> = {
  cases: { model: "case", fields: ["caseNumber","title","summary","status","priority","division","leadAgentId"], required: ["caseNumber","title","summary","division"] },
  subjects: { model: "subject", fields: ["fullName","dateOfBirth","alias","phone","address","notes","wanted","riskLevel","caseId"], required: ["fullName"] },
  vehicles: { model: "vehicle", fields: ["plate","make","model","color","ownerName","notes","wanted","caseId"], required: ["plate","make","model"] },
  evidence: { model: "evidence", fields: ["evidenceNumber","title","category","description","collectedBy","location","status","caseId"], required: ["evidenceNumber","title","category","description","collectedBy"] },
  reports: { model: "report", fields: ["reportNumber","type","title","body","authorId","caseId"], required: ["reportNumber","type","title","body"] },
  operations: { model: "operation", fields: ["operationCode","name","objective","status","classification","startAt","location","caseId"], required: ["operationCode","name","objective"] },
  aliases: { model: "coverIdentity", fields: ["code","aliasName","dateOfBirth","address","phone","status","authorizedBy","notes"], required: ["code","aliasName"] },
  cameras: { model: "camera", fields: ["name","location","status","notes"], required: ["name","location"] },
  divisions: { model: "division", fields: ["code","name","description","active"], required: ["code","name"] },
  agents: { model: "agent", fields: ["badgeNumber","name","rank","division","email","active"], required: ["badgeNumber","name","rank","division"] }
};

function dataFor(module: string, input: any) {
  const item = config[module];
  if (!item) throw new Error("Ismeretlen modul.");
  const data: Record<string, unknown> = {};
  for (const field of item.fields) if (input?.[field] !== undefined) {
    const value = input[field];
    // Convert empty optional values to null so Prisma accepts nullable fields.
    data[field] = value === "" ? null : value;
  }
  for (const field of item.required) {
    if (data[field] === undefined || data[field] === null || data[field] === "") throw new Error(`Kötelező mező: ${field}`);
  }
  return data;
}
function delegate(module: string): any {
  const item = config[module];
  if (!item) throw new Error("Ismeretlen modul.");
  return (prisma as any)[item.model];
}
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({error:"Bejelentkezés szükséges."},{status:401});
  const module = new URL(req.url).searchParams.get("module") || "";
  try {
    const records = await delegate(module).findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    return NextResponse.json({ records });
  } catch (e) {
    return NextResponse.json({error:"Nem sikerült betölteni az adatokat."},{status:400});
  }
}
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({error:"Bejelentkezés szükséges."},{status:401});
  try {
    const body = await req.json();
    const module = String(body.module || "");
    const data = dataFor(module, body.data);
    const record = await delegate(module).create({data});
    return NextResponse.json({record},{status:201});
  } catch (e) {
    return NextResponse.json({error:e instanceof Error ? e.message : "Létrehozási hiba."},{status:400});
  }
}
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({error:"Bejelentkezés szükséges."},{status:401});
  try {
    const body = await req.json();
    const module = String(body.module || "");
    const id = String(body.id || "");
    if (!id) return NextResponse.json({error:"Hiányzó rekordazonosító."},{status:400});
    const data = dataFor(module, body.data);
    const record = await delegate(module).update({where:{id},data});
    return NextResponse.json({record});
  } catch (e) {
    return NextResponse.json({error:e instanceof Error ? e.message : "Módosítási hiba."},{status:400});
  }
}
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || !["SUPERADMIN","ADMIN"].includes(session.role)) return NextResponse.json({error:"Adminisztrátori jogosultság szükséges."},{status:403});
  try {
    const body = await req.json();
    const module = String(body.module || "");
    const id = String(body.id || "");
    if (!id) return NextResponse.json({error:"Hiányzó rekordazonosító."},{status:400});
    await delegate(module).delete({where:{id}});
    return NextResponse.json({ok:true});
  } catch (e) {
    return NextResponse.json({error:"Törlési hiba. Lehet, hogy a rekord más adatokhoz kapcsolódik."},{status:400});
  }
}
