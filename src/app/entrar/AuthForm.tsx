"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, registerAction, type AuthState } from "./actions";

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-xl bg-brand-green py-3.5 text-[15px] font-extrabold text-white disabled:opacity-60"
    >
      {pending ? "Un momento..." : label}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-brand-line bg-white px-3 py-3 text-sm outline-none focus:border-brand-green";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, login, loginPending] = useActionState<AuthState, FormData>(
    loginAction,
    null,
  );
  const [regState, register, regPending] = useActionState<AuthState, FormData>(
    registerAction,
    null,
  );

  const state = mode === "login" ? loginState : regState;

  return (
    <div className="px-5 py-6">
      <div className="mb-5 flex rounded-xl bg-brand-chip p-1 text-sm font-bold">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg py-2 ${
            mode === "login" ? "bg-white text-brand-navy shadow-sm" : "text-brand-muted"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 rounded-lg py-2 ${
            mode === "register" ? "bg-white text-brand-navy shadow-sm" : "text-brand-muted"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-brand-red">
          {state.error}
        </div>
      )}
      {state?.info && (
        <div className="mb-4 rounded-xl bg-green-50 px-3 py-2.5 text-[13px] font-semibold text-brand-green-dark">
          {state.info}
        </div>
      )}

      {mode === "login" ? (
        <form action={login}>
          <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
            Correo
          </label>
          <input name="email" type="email" autoComplete="email" className={inputClass} />
          <label className="mb-1.5 mt-4 block text-xs font-bold text-[#39425c]">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
          />
          <SubmitButton label="Entrar" pending={loginPending} />
        </form>
      ) : (
        <form action={register}>
          <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
            Nombre o negocio
          </label>
          <input name="full_name" className={inputClass} placeholder="Ej: Ana G." />
          <label className="mb-1.5 mt-4 block text-xs font-bold text-[#39425c]">
            Teléfono (WhatsApp)
          </label>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            className={inputClass}
            placeholder="Ej: 240 222 000 000"
          />
          <label className="mb-1.5 mt-4 block text-xs font-bold text-[#39425c]">
            Zona <span className="font-normal text-brand-muted">(opcional)</span>
          </label>
          <input name="zone" className={inputClass} placeholder="Ej: Ela Nguema" />
          <label className="mb-1.5 mt-4 block text-xs font-bold text-[#39425c]">
            Correo
          </label>
          <input name="email" type="email" autoComplete="email" className={inputClass} />
          <label className="mb-1.5 mt-4 block text-xs font-bold text-[#39425c]">
            Contraseña{" "}
            <span className="font-normal text-brand-muted">(mín. 6 caracteres)</span>
          </label>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
          />
          <SubmitButton label="Crear mi cuenta" pending={regPending} />
        </form>
      )}

      <p className="mt-5 text-center text-xs text-brand-muted">
        Al continuar aceptas usar Mercado Semu de forma responsable.{" "}
        <Link href="/" className="font-semibold text-brand-green-dark">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
