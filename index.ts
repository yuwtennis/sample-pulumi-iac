import {Env, SampleBlogDirector} from "./pkgs/director";
import * as pulumi from "@pulumi/pulumi";
import {AWS} from "./pkgs/config"

async function main() {
    const config = new pulumi.Config()
    const data = config.requireObject<AWS>("aws")
    const builder = new SampleBlogDirector(
        data.account_id,
        pulumi.getOrganization(),
        pulumi.getProject())
    builder.create(Env[pulumi.getStack() as keyof typeof Env]);
}

(async () => {await main()})();
