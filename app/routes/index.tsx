import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  const _default_animate = { type: "spring", mass: 1.3 };

  const ANIMATION = {
    unMounted: { opacity: 0, y: 50 },
    mounted: {
      opacity: 1,
      y: 0,
      transition: {
        ..._default_animate,
        mass: 2.5,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        ..._default_animate,
        mass: 2.5,
      },
    },
  };

  return (
    <main className="relative min-h-screen bg-black sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION}
            initial="unMounted"
            animate="mounted"
            exit="unMounted"
          >
            <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
              <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
                <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  <span className="block text-yellow-500 drop-shadow-md">
                    harmonia.im
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                  Nossa missão é formar músicos que desejam servir com
                  excelência!!!
                </p>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  {user ? (
                    <Link
                      to="/notes"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Entrar com {user.email}
                    </Link>
                  ) : (
                    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                      <Link
                        to="/join"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                      >
                        Criar conta
                      </Link>
                      <Link
                        to="/login"
                        className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                      >
                        Entrar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
