# pulumi-sample

For local environment, this tutorial encourages you to use asdf.

## Pre requisite

- AWS account
- [asdf >= 0.16.0](https://github.com/asdf-vm/asdf)

## Tutorial

### local

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
asdf exec pulumi env set yuwtennis/blog/dev pulumiConfig.aws.account_id YOUR_AWS_ACCOUNT_ID
```

#### Install dependencies

```shell
asdf exec yarn install
```

#### Set environment variables

```shell
# e.g. STACK=dev
export STACK=YOUR_STACK
export PULUMI_ORG_NAME=YOUR_PULUMI_ORG_NAME
export PULUMI_ENV_NAME=aws
```

#### Deploy

```shell
asdf exec pulumi up --stack $STACK
```

#### Teardown
```shell
asdf exec pulumi destroy -C iac/ --stack $STACK
```