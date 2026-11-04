import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

const defaults = {
  organizationName: "FBI Operations Center",
  fieldOffice: "Los Santos Field Office",
  timezone: "America/Los_Angeles",
  casePrefix: "FBI",
  defaultClassification: "CONFIDENTIAL",
  language: "hu",
  dateFormat: "YYYY-MM-DD",
  notificationsEnabled: true
};
export async function GET() {
  const {session, allowed} = await requirePermission("settings.edit");
  if (!session) return NextResponse.json({error:"Bejelentkezés szükséges."},{status:401});
  if (!allowed) return NextResponse.json({error:"Nincs jogosultság."},{status:403});
  try {
    const rows = await prisma.appSetting.findMany();
    const values: Record<string, unknown> = {...defaults};
    for (const row of rows) values[row.key] = row.value;
    return NextResponse.json({settings:values});
  } catch {
    return NextResponse.json({error:"A beállítások betöltése sikertelen."},{status:500});
  }
}
export async function PUT(req:Request) {
  const {session, allowed} = await requirePermission("settings.edit");
  if (!session) return NextResponse.json({error:"Bejelentkezés szükséges."},{status:401});
  if (!allowed) return NextResponse.json({error:"Nincs jogosultság."},{status:403});
  try {
    const body = await req.json();
    const incoming = body?.settings;
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming))
      return NextResponse.json({error:"Érvénytelen beállítási adat."},{status:400});
    const permitted = Object.keys(defaults);
    const pairs = Object.entries(incoming).filter(([key])=>permitted.includes(key));
    await prisma.$transaction(pairs.map(([key,value])=>prisma.appSetting.upsert({
      where:{key}, create:{key,value: value as any}, update:{value:value as any}
    })));
    const rows = await prisma.appSetting.findMany();
    const settings:Record<string,unknown> = {...defaults};
    for (const row of rows) settings[row.key] = row.value;
    await prisma.auditEvent.create({data:{action:"SETTINGS_UPDATED",entity:"AppSetting",entityId:null,details:`Beállítások frissítve: ${pairs.map(([k])=>k).join(", ")}`}});
    return NextResponse.json({settings});
  } catch {
    return NextResponse.json({error:"A beállítások mentése sikertelen."},{status:500});
  }
}
