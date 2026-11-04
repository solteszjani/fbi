import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
export async function GET(){
 const {session,allowed}=await requirePermission("audit.view");
 if(!session)return NextResponse.json({error:"Bejelentkezés szükséges."},{status:401});
 if(!allowed)return NextResponse.json({error:"Nincs jogosultság."},{status:403});
 try{
  const events=await prisma.auditEvent.findMany({orderBy:{createdAt:"desc"},take:500,include:{actor:true}});
  return NextResponse.json({events});
 }catch{return NextResponse.json({error:"Az auditnapló betöltése sikertelen."},{status:500});}
}
