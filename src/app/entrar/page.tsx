import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries";
import { AuthForm } from "./AuthForm";

export default async function EntrarPage() {
  const profile = await getSessionProfile();
  if (profile) redirect("/perfil");

  return (
    <>
      <header className="bg-brand-navy px-5 pb-6 pt-6 text-center text-white">
        <h1 className="text-lg font-extrabold tracking-wide">
          MERCADO <span className="text-brand-green">SEMU</span>
        </h1>
        <p className="mt-1 text-xs text-[#c3cdf0]">
          Entra para vender, guardar favoritos y chatear.
        </p>
      </header>
      <AuthForm />
    </>
  );
}
