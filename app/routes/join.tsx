import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { motion } from "framer-motion";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (typeof name !== "string" || !name.length) {
    return json(
      {
        errors: { name: "Nome é obrigatório", email: null, password: null },
      },
      { status: 400 }
    );
  }

  if (!validateEmail(email)) {
    return json(
      { errors: { name: null, email: "Email é invalido", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { name: null, email: null, password: "Senha é obrigatório" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { name: null, email: null, password: "Senha é muito curta" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          name: null,
          email: "Um usuário com esse email já existe",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(name, email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

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
    <div className="flex min-h-full flex-col justify-center bg-black">
      <div className="mx-auto w-full max-w-md px-8">
        <motion.div
          variants={ANIMATION}
          initial="unMounted"
          animate="mounted"
          exit="unMounted"
        >
          <Form method="post" className="space-y-6">
            <div>
              <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                <span className="block text-yellow-500 drop-shadow-md">
                  harmonia.im
                </span>
              </h1>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Digite seu nome
              </label>
              <div className="mt-1">
                <input
                  ref={nameRef}
                  id="name"
                  required
                  autoFocus={true}
                  name="name"
                  type="name"
                  autoComplete="name"
                  aria-invalid={actionData?.errors?.name ? true : undefined}
                  aria-describedby="name-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg outline-none"
                />
                {actionData?.errors?.name && (
                  <div className="pt-1 text-red-700" id="email-error">
                    {actionData?.errors?.name}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Digite seu email
              </label>
              <div className="mt-1">
                <input
                  ref={emailRef}
                  id="email"
                  required
                  autoFocus={true}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg outline-none"
                />
                {actionData?.errors?.email && (
                  <div className="pt-1 text-red-700" id="email-error">
                    {actionData.errors.email}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Digite sua senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg outline-none"
                />
                {actionData?.errors?.password && (
                  <div className="pt-1 text-red-700" id="password-error">
                    {actionData.errors.password}
                  </div>
                )}
              </div>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
              type="submit"
              className="w-full rounded bg-yellow-500  py-2 px-4 text-white hover:bg-yellow-600 focus:bg-yellow-500"
            >
              Criar conta
            </button>
            <div className="flex items-center justify-center">
              <div className="text-center text-sm text-white">
                Já possui uma conta ?{" "}
                <Link
                  className="text-yellow-400 underline"
                  to={{
                    pathname: "/login",
                    search: searchParams.toString(),
                  }}
                >
                  Entrar
                </Link>
              </div>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
