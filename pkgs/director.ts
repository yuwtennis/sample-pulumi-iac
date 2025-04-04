import {SampleBlogBuilder} from "./builder";

const DEV_SPEC = {
    vpc_name: 'main',
    vpc_cidr: '10.0.0.0/16',
    subnet_private_name: 'main',
    subnet_private_cidr: '10.0.1.0/24',
    blog_repos_name: "blog",
}

export enum Env {
    dev,
}

export class SampleBlogDirector {

    constructor(
        public readonly aws_account_id: string,
        public readonly pulumi_org_name: string,
        public readonly pulumi_proj_name: string) {
    }

    public create(env: Env) : any {
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
                    this.aws_account_id,
                    this.pulumi_org_name,
                    this.pulumi_proj_name
                )
                .build();
        } else {
            console.log(`Invalid environment. ${env}`)
        }
    }
}