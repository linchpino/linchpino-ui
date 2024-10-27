"use client"

import {FC} from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

interface QueryProps{
    children:any;
}

const QueryProvider : FC<QueryProps> = (props)=> {
    const {children} = props;
    const queryClient = new QueryClient()

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
export default QueryProvider
