import {SampleBlogBuilder} from "./builder";

const DEV_SPEC = {
    vpc_name: 'main',
    vpc_cidr: '10.0.0.0/16',
    subnet_private_name: 'main',
    subnet_private_cidr: '10.0.1.0/24',
    blog_repos_name: "blog",
    pulumi_oidc_provider_name: "api.pulumi.com/oidc"
}

export enum Env {
    dev,
}

export class SampleBlogDirector {

    public static create(account: string, env: Env) : any {
        if (env == Env.dev) {
            return new SampleBlogBuilder()
                .withNetwork(
                    DEV_SPEC.vpc_name,
                    DEV_SPEC.vpc_cidr,
                    [
                        {name: DEV_SPEC.subnet_private_name, cidr: DEV_SPEC.subnet_private_cidr}
                    ]
                )
                .withContainerRegistry(
                    [
                        {name: DEV_SPEC.blog_repos_name}
                    ]
                )
                .withPulumiOidcProvider(
                    account,
                    DEV_SPEC.pulumi_oidc_provider_name
                )
                .build();
        } else {
            console.log(`Invalid environment. ${env}`)
        }
    }
}