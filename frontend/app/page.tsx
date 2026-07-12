import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-112px)] w-full items-center bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl space-y-6 text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-brand-900/90 md:text-4xl">
            O seu parceiro em
          </h2>
          <div className="bg-gradient-to-r from-brand-500 to-brand-900 bg-clip-text py-2 text-6xl font-bold tracking-tighter text-transparent md:text-7xl">
            Gestão de Tickets
          </div>
          <p className="max-w-xl text-lg text-gray-600">
            Mini Inbox — liste, edite e acompanhe tickets de suporte, com
            métricas geradas a partir de um pipeline de dados real.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tickets"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-500 px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              VER TICKETS
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border-2 border-brand-900/80 bg-white px-8 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50"
            >
              VER DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
