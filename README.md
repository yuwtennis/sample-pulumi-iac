# pulumi-sample

For local environment, this tutorial encourages you to use asdf.

## Pre requisite
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

#### Install dependencies

```shell
asdf exec yarn install
```

#### Specify stackname

```shell
# e.g. STACK=dev
export STACK=YOUR_STACK
```

#### Deploy

```shell
asdf exec pulumi up -C iac/ --stack $STACK
```

#### Teardown
```shell
asdf exec pulumi destroy -C iac/ --stack $STACK
```