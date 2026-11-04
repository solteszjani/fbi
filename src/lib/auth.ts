import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const COOKIE = "fbi_session";
const SECRET = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || "change-this-secret-before-production";
export const ALL_PERMISSIONS = ["dashboard.view","cases.view","cases.create","cases.edit","subjects.view","subjects.edit","vehicles.view","vehicles.edit","evidence.view","evidence.edit","reports.view","reports.create","operations.view","operations.edit","agents.view","agents.edit","admin.users","admin.permissions","audit.view","settings.edit"];
export const ROLE_PERMISSIONS: Record<string,string[]> = {
 SUPERADMIN: ALL_PERMISSIONS,
 ADMIN: ALL_PERMISSIONS.filter(p=>p!=="settings.edit"),
 SUPERVISOR: ["dashboard.view","cases.view","cases.create","cases.edit","subjects.view","subjects.edit","vehicles.view","vehicles.edit","evidence.view","evidence.edit","reports.view","reports.create","operations.view","operations.edit","agents.view","audit.view"],
 AGENT: ["dashboard.view","cases.view","cases.create","subjects.view","vehicles.view","evidence.view","reports.view","reports.create","operations.view"],
 VIEWER: ["dashboard.view","cases.view","subjects.view","vehicles.view","evidence.view","reports.view","operations.view"]
};
export function passwordHash(password:string,salt=randomBytes(16).toString("hex")){return {salt,hash:scryptSync(password,salt,64).toString("hex")};}
export function verifyPassword(password:string,salt:string,hash:string){try{const a=scryptSync(password,salt,64),b=Buffer.from(hash,"hex");return a.length===b.length&&timingSafeEqual(a,b)}catch{return false}}
function sign(value:string){return createHmac("sha256",SECRET).update(value).digest("hex")}
export async function createSession(user:{id:string;username:string;role:string}){const payload=Buffer.from(JSON.stringify({...user,exp:Date.now()+1000*60*60*12})).toString("base64url");const token=`${payload}.${sign(payload)}`;(await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*12});}
export async function getSession(){const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const [payload,signature]=token.split(".");if(!payload||!signature)return null;const expected=sign(payload);if(signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;try{const data=JSON.parse(Buffer.from(payload,"base64url").toString());if(data.exp<Date.now())return null;const user=await prisma.user.findUnique({where:{id:data.id}});if(!user||!user.active)return null;return {id:user.id,username:user.username,displayName:user.displayName,role:user.role,permissions:Array.isArray(user.permissions)?user.permissions as string[]:ROLE_PERMISSIONS[user.role]||[]};}catch{return null}}
export async function requirePermission(permission:string){const session=await getSession();if(!session)return {session:null,allowed:false};const perms=session.role==="SUPERADMIN"?ALL_PERMISSIONS:((session.permissions?.length?session.permissions:ROLE_PERMISSIONS[session.role])||[]);return {session,allowed:perms.includes(permission)}}
export async function logout(){(await cookies()).delete(COOKIE)}
