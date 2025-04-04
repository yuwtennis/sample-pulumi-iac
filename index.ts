import {Env, SampleBlogDirector} from "./pkgs/director";
import * as pulumi from "@pulumi/pulumi";
import * as esc from "@pulumi/esc-sdk";;

async function main() {
    const orgName: string = process.env.PULUMI_ORG_NAME!;
    const envName: string = process.env.PULUMI_ENV_NAME!;
    const projName: string = pulumi.getProject();
    const client = esc.DefaultClient();

    const openEnv = await client.openAndReadEnvironment(
        orgName, projName, envName);

    if (!openEnv) {
        console.error("Failed to open and read the environment");
        return;
    }
    const aws_account_id = openEnv.values?.dev.account;

    //console.log(`Deploying stack for ${pulumi.getStack()}`)

    //const builder = new SampleBlogDirector(
    //    aws_account_id,
    //    orgName,
    //    projName)
    //builder.create(Env[pulumi.getStack() as keyof typeof Env]);
}

(async () => {await main()})();
