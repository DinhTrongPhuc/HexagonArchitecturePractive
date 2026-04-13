import { promises as fs } from "node:fs";
import path from "node:path";
import {
    type AccountInfo,
    type AuthenticationResult,
    type DeviceCodeRequest,
    InteractionRequiredAuthError,
    type ICachePlugin,
    type SilentFlowRequest,
    type TokenCacheContext,
    PublicClientApplication,
} from "@azure/msal-node";

export interface MsalTokenCacheOptions {
    clientId: string;
    tenantId: string;
    scopes: string[];
    cacheFilePath?: string;
    accountIdentifier?: string;
    deviceCodeCallback?: DeviceCodeRequest["deviceCodeCallback"];
}

class FileTokenCachePlugin implements ICachePlugin {
    constructor(private readonly cacheFilePath: string) {}

    async beforeCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
        const cache = await this.readCacheFile();
        cacheContext.tokenCache.deserialize(cache);
    }

    async afterCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
        if (!cacheContext.cacheHasChanged) {
            return;
        }

        const cache = cacheContext.tokenCache.serialize();
        await fs.mkdir(path.dirname(this.cacheFilePath), { recursive: true });
        await fs.writeFile(this.cacheFilePath, cache, "utf8");
    }

    private async readCacheFile(): Promise<string> {
        try {
            return await fs.readFile(this.cacheFilePath, "utf8");
        } catch (error: unknown) {
            const code = (error as NodeJS.ErrnoException).code;
            if (code === "ENOENT") {
                return "";
            }

            throw error;
        }
    }
}

export class MsalTokenCache {
    private readonly scopes: string[];
    private readonly accountIdentifier: string | undefined;
    private readonly pca: PublicClientApplication;
    private readonly deviceCodeCallback: DeviceCodeRequest["deviceCodeCallback"] | undefined;

    constructor(options: MsalTokenCacheOptions) {
        if (!options.clientId) {
            throw new Error("OUTLOOK_CLIENT_ID is required");
        }

        if (!options.tenantId) {
            throw new Error("OUTLOOK_TENANT_ID is required");
        }

        if (!options.scopes.length) {
            throw new Error("At least one Outlook scope is required");
        }

        this.scopes = options.scopes;
        this.accountIdentifier = options.accountIdentifier;
        this.deviceCodeCallback = options.deviceCodeCallback;

        const cacheFilePath =
            options.cacheFilePath ??
            path.resolve(process.cwd(), ".auth", "msal-token-cache.json");

        this.pca = new PublicClientApplication({
            auth: {
                clientId: options.clientId,
                authority: `https://login.microsoftonline.com/${options.tenantId}`,
            },
            cache: {
                cachePlugin: new FileTokenCachePlugin(cacheFilePath),
            },
        });
    }

    async getAccessToken(): Promise<string> {
        const authResult = await this.getAuthenticationResult();
        if (!authResult.accessToken) {
            throw new Error("MSAL did not return an access token");
        }

        return authResult.accessToken;
    }

    async getAuthenticationResult(forceDeviceCode = false): Promise<AuthenticationResult> {
        if (!forceDeviceCode) {
            const account = await this.findCachedAccount();
            if (account) {
                try {
                    return await this.acquireTokenSilent(account);
                } catch (error: unknown) {
                    if (!this.shouldFallbackToInteractive(error)) {
                        throw error;
                    }
                }
            }
        }

        const authResult = await this.pca.acquireTokenByDeviceCode({
            scopes: this.scopes,
            deviceCodeCallback:
                this.deviceCodeCallback ?? this.defaultDeviceCodeCallback,
        });

        if (!authResult) {
            throw new Error("Unable to acquire token via device code flow");
        }

        return authResult;
    }

    async clearCache(): Promise<void> {
        const accounts = await this.pca.getAllAccounts();
        await Promise.all(accounts.map((account) => this.pca.signOut({ account })));
    }

    private async acquireTokenSilent(account: AccountInfo): Promise<AuthenticationResult> {
        const request: SilentFlowRequest = {
            account,
            scopes: this.scopes,
            forceRefresh: false,
        };

        return this.pca.acquireTokenSilent(request);
    }

    private async findCachedAccount(): Promise<AccountInfo | undefined> {
        const accounts = await this.pca.getAllAccounts();
        if (!accounts.length) {
            return undefined;
        }

        if (!this.accountIdentifier) {
            return accounts[0];
        }

        const identifier = this.accountIdentifier.toLowerCase();
        return accounts.find((account) => {
            return (
                account.username.toLowerCase() === identifier ||
                account.homeAccountId.toLowerCase() === identifier ||
                account.localAccountId.toLowerCase() === identifier
            );
        });
    }

    private shouldFallbackToInteractive(error: unknown): boolean {
        if (error instanceof InteractionRequiredAuthError) {
            return true;
        }

        const message = error instanceof Error ? error.message.toLowerCase() : "";
        return (
            message.includes("interaction_required") ||
            message.includes("login_required") ||
            message.includes("consent_required") ||
            message.includes("no_tokens_found")
        );
    }

    private readonly defaultDeviceCodeCallback: DeviceCodeRequest["deviceCodeCallback"] = (
        response,
    ) => {
        console.log("\n=================== AUTH REQUIRED ===================");
        console.log("Open:", response.verificationUri);
        console.log("Code:", response.userCode);
        console.log("====================================================\n");
    };
}
