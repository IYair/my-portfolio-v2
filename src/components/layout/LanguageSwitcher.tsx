"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

const languages = [
  { code: "es", name: "Español", label: "ES" },
  { code: "en", name: "English", label: "EN" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const currentLanguage = languages.find(lang => lang.code === locale);

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton
        disabled={isPending}
        className="text-foreground/60 hover:text-foreground flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <GlobeAltIcon className="h-5 w-5" />
        <span className="hidden font-semibold sm:inline">{currentLanguage?.label}</span>
      </MenuButton>

      <MenuItems
        transition
        className="bg-background border-foreground/10 absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border shadow-lg transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <div className="p-1">
          {languages.map(lang => (
            <MenuItem key={lang.code}>
              {({ focus }) => (
                <button
                  onClick={() => onSelectChange(lang.code)}
                  className={`${focus ? "bg-foreground/5" : ""} ${
                    locale === lang.code ? "bg-foreground/10 font-semibold" : ""
                  } flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors`}
                >
                  <span className="font-semibold">{lang.label}</span>
                  <span>{lang.name}</span>
                  {locale === lang.code && <span className="ml-auto text-xs">✓</span>}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
