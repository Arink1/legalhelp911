import type { Metadata } from "next";
import Link from "next/link";
import VideoHero from "@/components/VideoHero";
import StickyActionBar from "@/components/StickyActionBar";
import PhotoSlot from "@/components/PhotoSlot";
import { Footer } from "@/components/SiteChrome";
import { PhoneIcon, MessageIcon } from "@/components/Icons";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  SMS_LINK,
  FIRM_NAME,
  YEARS_IN_PRACTICE,
  PRACTICE_AREAS,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${FIRM_NAME} | Hable con un abogado hoy`,
  description: `¿Accidente, arresto o papeles de la corte? ${YEARS_IN_PRACTICE} años de experiencia y consulta gratis. Llame al ${PHONE_DISPLAY}.`,
  alternates: { canonical: "/es", languages: { "en-US": "/", "es-US": "/es" } },
};

// Spanish practice-area names, written out rather than machine-translated.
const AREAS_ES: Record<string, string> = {
  injury: "Accidentes y lesiones",
  "criminal-defense": "Defensa criminal",
  "family-divorce": "Familia y divorcio",
  immigration: "Inmigración",
  employment: "Empleo",
  bankruptcy: "Bancarrota",
  "workers-compensation": "Compensación laboral",
  "real-estate": "Bienes raíces",
  "wills-estates": "Testamentos y herencias",
  business: "Negocios",
};

/**
 * Screen 3d, Español. A real page on its own URL with hreflang, not a
 * translate widget and not a flag icon. The trust signal is a named person
 * who answers in Spanish.
 *
 * TODO: this copy was written for the wireframe. Have a native speaker or a
 * professional translator review every line before launch, and never machine
 * translate legal copy.
 */
export default function EspanolPage() {
  return (
    <div lang="es">
      <main>
        <VideoHero clip="hero-loop" scrim="bottom">
          <div className="relative flex min-h-[560px] flex-col">
            <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6">
              <Link
                href="/"
                hrefLang="en"
                className="pill border-[1.75px] border-white/85 px-3 py-1.5 text-[12px] text-white hover:bg-white hover:text-ink"
              >
                EN
              </Link>
              <a href={PHONE_TEL} className="pill pill-primary px-4 py-2 text-[13px]">
                <PhoneIcon className="h-4 w-4" />
                Llámenos
              </a>
            </div>

            <div className="flex-1" />

            <div className="px-4 pb-5 pt-14 sm:px-6">
              <h1 className="max-w-xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] text-white sm:text-[34px]">
                ¿Accidente, arresto o papeles de la corte? Hable con un abogado
                hoy.
              </h1>
              <p className="mt-3 text-[13px] font-semibold text-white/60">
                {YEARS_IN_PRACTICE} años &middot; consulta gratis
              </p>
              <div className="mt-5 max-w-md space-y-2.5">
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_hero_es"
                  className="pill pill-primary min-h-[60px] w-full text-[17px]"
                >
                  <PhoneIcon className="h-5 w-5" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={SMS_LINK}
                  data-analytics="text_tap_hero_es"
                  className="pill w-full border-[1.75px] border-white/85 text-white hover:bg-white hover:text-ink"
                >
                  <MessageIcon className="h-4 w-4" />
                  Mándenos un mensaje
                </a>
              </div>
              <p className="mt-3 max-w-md text-center text-[11px] text-white/60">
                Preguntar no cuesta nada. Sin compromiso.
              </p>
            </div>
          </div>
        </VideoHero>

        {/* The trust signal is a named person who actually speaks Spanish,
            not a flag icon. Jesmany Jomarron is Of Counsel and bilingual. */}
        <section className="border-b border-line bg-card">
          <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-7 sm:px-6 lg:max-w-4xl">
            <PhotoSlot
              label="Abogado"
              className="h-[72px] w-[72px] shrink-0"
              rounded="rounded-full"
            />
            <div>
              <p className="kicker">Quien le atiende en espanol</p>
              <p className="mt-1.5 font-display text-lg font-bold">
                Jesmany Jomarron, Esq.
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Abogado litigante, Of Counsel de la firma. Habla espanol y
                puede revisar su caso directamente. No usamos traductor
                automatico.
              </p>
              <Link
                href="/attorneys/jesmany-jomarron"
                className="mt-2 inline-block text-[13px] font-semibold text-ink underline underline-offset-4"
              >
                Ver su perfil
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-4xl">
          <p className="kicker">Áreas de práctica</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {PRACTICE_AREAS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/practice/${p.slug}`}
                  className="frame flex h-full items-center bg-card p-4 text-[13.5px] font-semibold leading-tight transition hover:border-brass"
                >
                  {AREAS_ES[p.slug] ?? p.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[12px] leading-relaxed text-muted">
            Las páginas de cada área todavía están en inglés. Llámenos y le
            atendemos en español.
          </p>
        </section>
      </main>
      <Footer />
      <StickyActionBar labels={{ call: "Llamar", text: "Texto", form: "Formulario" }} />
    </div>
  );
}
