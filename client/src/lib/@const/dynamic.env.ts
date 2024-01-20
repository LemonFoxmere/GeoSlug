/**
 * This file stores any environment variables that depends on production / development contexts.
 */

import { PUBLIC_DEV_API_HOST, PUBLIC_PROD_API_HOST } from "$env/static/public";

export const API_HOST = import.meta.env.DEV ? PUBLIC_DEV_API_HOST : PUBLIC_PROD_API_HOST;