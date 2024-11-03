import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

const locale = process.env.NEXT_PUBLIC_LANGUAGE || 'fa';

export const routing = defineRouting({
    locales: [locale],
    defaultLocale: locale,
});

export const { Link, redirect, usePathname, useRouter } =
    createSharedPathnamesNavigation(routing);
