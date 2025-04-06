# pulumi-sample

## Pre requisite

- AWS account
- [asdf >= 0.16.0](https://github.com/asdf-vm/asdf)

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
asdf exec pulumi config env init 
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.aws.account_id YOUR_AWS_ACCOUNT_ID
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.vpc_name main
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.vpc_cidr 10.0.0.0/16
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.subnet_private_name main
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.subnet_private_cidr 10.0.1.0/24
asdf exec pulumi env set yuwtennis/iac/dev pulumiConfig.spec.blog_repos_name blog
```

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