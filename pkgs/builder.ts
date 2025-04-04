import * as aws from "@pulumi/aws";

// Constant
const PULUMI_OIDC_PROVIDER_URL = "api.pulumi.com/oidc"

// Primitive name preferably business application name represents this project
export class SampleBlog {
    constructor(
        public readonly network: Network,
        public readonly containerRegistry: Array<aws.ecr.Repository>,
        public readonly oidcProvider: aws.iam.OpenIdConnectProvider,
        public readonly iamRoles: Array<aws.iam.Role>,
    ) {}
}

export class Network {
    constructor(
        public readonly vpc: aws.ec2.Vpc,
        public readonly subnets: Array<aws.ec2.Subnet> = []
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
    private oidcProvider!: aws.iam.OpenIdConnectProvider;
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

    public withPulumiOidcProvider(aws_account_id: string, pulumi_org_name: string): this {
        this.oidcProvider = new aws.iam.OpenIdConnectProvider("pulumi_oidc_provider", {
                url: `https://${PULUMI_OIDC_PROVIDER_URL}`,
                clientIdLists: [`aws:${pulumi_org_name}`]
            })

        // Static for now
        const assumeRole = aws.iam.getPolicyDocument({
            statements: [{
                effect: "Allow",
                actions: ["sts:AssumeRoleWithWebIdentity"],
                sid: "",
                principals: [{
                    type: "Federated",
                    identifiers: [`arn:aws:iam::${aws_account_id}:oidc-provider/${PULUMI_OIDC_PROVIDER_URL}`],
                }],
                conditions: [{
                    test: "StringEquals",
                    variable: `${PULUMI_OIDC_PROVIDER_URL}:aud`,
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
        return new SampleBlog(
            this.network,
            this.containerRegistry,
            this.oidcProvider,
            this.iamRoles);
    }
}