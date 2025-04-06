import {PlatformBuilder} from "./builder";
import {SpecSchema} from "./config";

export enum Env {
    dev,
}

export class Director {

    constructor(
        public readonly pulumi_org_name: string,
        public readonly pulumi_proj_name: string) {
    }

    public create(env: Env, config: SpecSchema) : any {
        if (env == Env.dev) {
            return new PlatformBuilder(config.account_id)
                .withNetwork(
                    config.vpc_name,
                    config.vpc_cidr,
                    [
                        {name: config.subnet_private_name, cidr: config.subnet_private_cidr}
                    ]
                )
                .withContainerRegistry(
                    [
                        {name: config.blog_repos_name}
                    ]
                )
                .withPulumiOidcProvider(
                    this.pulumi_org_name,
                    this.pulumi_proj_name
                )
                .build();
        } else {
            console.log(`Invalid environment. ${env}`)
        }
    }
}