import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import {getMessages} from 'next-intl/server';
import LocaleClientLayout from './LocalClientLayout';

export default async function LocaleLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = process.env.NEXT_PUBLIC_LANGUAGE;
    const messages = await getMessages();
    const direction = locale === 'en' ? 'ltr' : 'rtl';

    return (
        <LocaleClientLayout
            messages={messages}
            direction={direction}
            //@ts-ignore
            locale={locale}
        >
            {children}
        </LocaleClientLayout>
    );
}
