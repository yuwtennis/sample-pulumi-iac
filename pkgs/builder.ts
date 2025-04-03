import * as aws from "@pulumi/aws";

// Primitive name preferably business application name represents this project
export class SampleBlog {
    constructor(
        public readonly network: Network,
        public readonly containerRegistry: Array<aws.ecr.Repository>,
        public readonly cloudStorage: aws.s3.BucketV2
    ) {}
}

export class Network {
    constructor(
        public readonly vpc: aws.ec2.Vpc,
        public readonly subnets: Array<aws.ec2.Subnet> = []
    ) {}
}

export class OidcProvider {
    constructor(
        public readonly pulumi_oidc_provider: aws.iam.OpenIdConnectProvider
    ) {}
}

type SubnetSpec = {
    name: string,
    cidr: string
}

type ContainerRegistrySpec = {
    name: string
}

export class SampleBlogBuilder {
    private network!: Network;
    private containerRegistry: Array<aws.ecr.Repository> = [];
    private oidcProvider!: OidcProvider;
    private cloudStorage!: aws.s3.BucketV2;
    private iamRoles: Array<aws.iam.Role> = [];

    public withNetwork(
        vpcName: string,
        vpcCidrBlock: string,
        subnetSpecs: Array<SubnetSpec>): this {
        const vpc = new aws.ec2.Vpc(vpcName, {cidrBlock: vpcCidrBlock});
        const subnets: Array<aws.ec2.Subnet> = [];

        for (let s of subnetSpecs) {
            subnets.push(
                new aws.ec2.Subnet(
                    s.name,
                    {
                        vpcId: vpc.id,
                        cidrBlock: s.cidr
                    }
                )
            );
        }

        this.network = new Network(vpc, subnets);
        return this;
    }

    public withContainerRegistry(registries: Array<ContainerRegistrySpec>): this {
        for (let c of registries) {
            this.containerRegistry.push(
                new aws.ecr.Repository(c.name, {
                    name: c.name,
                    imageTagMutability: 'IMMUTABLE',
                    imageScanningConfiguration: {
                        scanOnPush: true,
                    }
                })
            )
        }
        return this;
    }

    public withPulumiOidcProvider(account: string, provider_url: string): this {
        this.oidcProvider = new OidcProvider(
            new aws.iam.OpenIdConnectProvider("pulumi_oidc_provider", {
                url: `https://${provider_url}`,
                clientIdLists: ["aws:myorg"]
            })
        )

        // Static for now
        const assumeRole = aws.iam.getPolicyDocument({
            statements: [{
                effect: "Allow",
                actions: ["sts:AssumeRoleWithWebIdentity"],
                sid: "",
                principals: [{
                    type: "Federated",
                    identifiers: [`arn:aws:iam::${account}:oidc-provider/${provider_url}`],
                }],
                conditions: [{
                    test: "StringEquals",
                    variable: `${provider_url}:aud`,
                    values: ["pulumi"]
                }]
            }]
        })

        const role = new aws.iam.Role(
            "pulumi_sa", {
                name: "pulumi_sa",
                assumeRolePolicy: assumeRole.then(
                    assumeRole => assumeRole.json)
            })

        new aws.iam.RolePolicyAttachment("pulumi_deploy_permissions_attach", {
            role: role.name,
            policyArn: aws.iam.getPolicy({name: "AdministratorAccess"}).then(
                policy => policy.arn)
        })

        this.iamRoles.push(role)
        return this;
    }

    build(): any {
        return this;
    }
}