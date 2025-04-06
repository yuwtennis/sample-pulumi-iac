# pulumi-sample

## What does this repository aim to solve ?

This repository is a working example of Continuous deployment for IaC using [Pulumi cloud](https://www.pulumi.com/docs/pulumi-cloud/).  
I hope this will be a good example for people who want to see working configuration example.

There is a fantastic blog by Pulumi so if you want a general best practices please check [the blog](https://www.pulumi.com/blog/iac-best-practices-understanding-code-organization-stacks/).

## Concept

### Tokenless authentication

One of the questions that you need to solve before implementing continuous deployment are authentication between entities.  
This is an issue which you have to go through when you are connecting two platform.

Do we need to manage credentials for authentication ?

In this case, between below entities

- Git Repository
- Continous Deployment platform
- Cloud provider

In my personal opinion, this answer SHOULD be no. Since being stateful with tokens just creates another issues.  
Thanks to Pulumi cloud, it natively supports the OpenID connect framework with other entities.

In below diagram, administrators will not manage ANY token for the continuous deployment flow.

![](./imgs/auth-entity-relationship.png)

### Stack per branch approach

I only have a single branch which represents development branch but I have imaged _stack per branch approach_ for this repos  
where team members can work for _single source of truth_.  

Below workflow is a sample that has _dev_, _stg_, _prod_ branch as a single source of truth for each environment.  
The production source is tagged so it can be reproduced from working example in case of emergency.

![](./imgs/simple-workflow.png)

### The lifecycle

When there is a _beginning_ there is an _end_.  
This is not exceptional in this IaC management.  This repository assumes 3 states during the administration.

Below is the diagram describes the states.

![](./imgs/lifecycle.png)

_ _NONE_ is the state where nothing is there.
- _init_ is the state where _stack_ is created and resources are _first_ deployed to the cloud provider.
- _change_ is the state where members start commiting and the states changes rapidly.
- _terminated_ is the state where resources are destroyed from the cloud provider.

## Pre requisite

- AWS account
- [asdf >= 0.16.0](https://github.com/asdf-vm/asdf)
- [Pulumi cloud account](https://www.pulumi.com/docs/pulumi-cloud/)

## Tutorial

### local

For local environment, this tutorial encourages you to use asdf.

#### Setup

```shell
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add yarn https://github.com/twuni/asdf-yarn.git
asdf plugin add pulumi https://github.com/canha/asdf-pulumi.git
asdf install nodejs
asdf install yarn
asdf install pulumi
```

Prepare variables

```shell
asdf exec pulumi stack init dev
asdf exec pulumi config env init 
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.aws.account_id YOUR_AWS_ACCOUNT_ID
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.vpc_name main
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.vpc_cidr 10.0.0.0/16
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.subnet_private_name main
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.subnet_private_cidr 10.0.1.0/24
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.blog_repos_name blog
```

The repository assumes token less exchange with AWS.  
Setup [github integration in the doc](https://www.pulumi.com/docs/pulumi-cloud/deployments/get-started/deployments-using-cli/) and with [OIDC provider setup](https://www.pulumi.com/docs/pulumi-cloud/access-management/oidc/provider/aws/).

Role arn will be available after you initialize the lifecycle.

#### Install dependencies

```shell
asdf exec yarn install
```

#### Set environment variables

```shell
# e.g. STACK=dev
export STACK=YOUR_STACK
```

#### Deploy

```shell
asdf exec pulumi up --stack $STACK
```

#### Teardown
```shell
asdf exec pulumi destroy --stack $STACK
```